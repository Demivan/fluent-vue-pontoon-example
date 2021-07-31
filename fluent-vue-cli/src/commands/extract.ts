import {Command, flags} from '@oclif/command'

import path from 'path'
import {readFile, writeFile, ensureDir} from 'fs-extra'
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
    outDir: flags.string({required: true}),
  }

  static args = [{
    name: 'files',
    description: 'list of files to extact translations from',
    required: true,
  }]

  static strict = false

  async run() {
    const {argv: patterns, flags} = this.parse(Extract)

    const files = await Promise.all(
      patterns.map(pattern => glob(pattern, {cwd: process.cwd()}))
    )

    const allFiles = files.flat()

    for (const file of allFiles.filter(file => file.endsWith('.vue'))) {
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

        // eslint-disable-next-line no-await-in-loop
        await writeOutput(flags.outDir, locale, file, block.content)
      }
    }
  }
}
