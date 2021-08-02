import {Command, flags} from '@oclif/command'

import path from 'path'
import {readFile, writeFile, ensureDir, rm} from 'fs-extra'
import {parse} from '@vue/compiler-sfc'
import glob from 'tiny-glob'

async function writeOutput(baseDir: string, locale: string, file: string, content: string) {
  const outFile = path.resolve(baseDir, locale, `${file}.ftl`)
  await ensureDir(path.dirname(outFile))
  await writeFile(outFile, content)
}

export default class Extract extends Command {
  static description = 'extracts translations from Vue components'

  static examples = [
    '$ fluent-vue extract src/**/*.vue',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'srcDir',
      description: 'base directory of source files',
      required: true,
    },
    {
      name: 'translationDir',
      description: 'base translation directory',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(Extract)

    const allFiles = await glob(path.join(args.srcDir, '**/*.vue'), {cwd: process.cwd()})

    await rm(args.translationDir, {recursive: true})

    for (const file of allFiles) {
      // eslint-disable-next-line no-await-in-loop
      const data = await readFile(file)

      const parsed = parse(data.toString())

      for (const error of parsed.errors) {
        this.error('Error parsing Vue file: ' + error)
      }

      const allBlocks = parsed.descriptor.customBlocks
      // TODO: Read block type
      const fluentBlocks = allBlocks.filter(block => block.type === 'fluent')

      for (const block of fluentBlocks) {
        const locale = block.attrs.locale
        if (typeof locale !== 'string') {
          this.log(`File ${file} has fluent custom block without locale attribute`)
          continue
        }

        const adjustedContent = block.content.replace(/^\s+|\s+$/g, '') + '\n'

        // eslint-disable-next-line no-await-in-loop
        await writeOutput(args.translationDir, locale, path.relative(args.srcDir, file), adjustedContent)
      }
    }
  }
}
