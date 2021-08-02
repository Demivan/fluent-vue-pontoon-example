/* eslint-disable no-await-in-loop */

import {Command, flags} from '@oclif/command'

import path from 'path'
import {readFile, writeFile, ensureDir} from 'fs-extra'
import glob from 'tiny-glob'
import {parse} from '@vue/compiler-sfc'

function replaceBetween(origin: string, startIndex: number, endIndex: number, content: string): string {
  return origin.substring(0, startIndex) + content + origin.substring(endIndex)
}

async function writeOutput(baseDir: string, locale: string, file: string, content: string) {
  const outFile = path.resolve(baseDir, locale, `${file}.ftl`)
  await ensureDir(path.dirname(outFile))
  await writeFile(outFile, content)
}

export default class Import extends Command {
  static description = 'imports fluent translations into Vue components'

  static examples = [
    '$ fluent-vue import',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'translationDir',
      description: 'base translation directory',
      required: true,
    },
    {
      name: 'srcDir',
      description: 'base directory of source files',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(Import)

    const ftlFiles = await glob(path.join(args.translationDir, '**/*.ftl'))

    for (const file of ftlFiles) {
      const targetFile = file.replace(/\.vue\.ftl$/, '.vue')
      const relativeFile = path.relative(args.translationDir, targetFile)
      const [locale, ...paths] = relativeFile.split(path.sep)
      const finalFile = path.resolve(args.srcDir, ...paths)

      const contentBuffer = await readFile(file)
      const content = contentBuffer.toString()

      const vueContentBuffer = await readFile(finalFile)
      const vueContent = vueContentBuffer.toString()

      const parsedVueContent = parse(vueContent)

      if (parsedVueContent.errors.length > 0) {
        for (const error of parsedVueContent.errors) {
          this.log('Error parsing Vue SFC file', error)
        }

        continue
      }

      const existingBlock = parsedVueContent.descriptor.customBlocks.find(block => block.type === 'fluent' && block.attrs.locale === locale)

      let newVueContent
      if (existingBlock) {
        existingBlock.loc.end.offset
        newVueContent = replaceBetween(vueContent, existingBlock.loc.start.offset + 1, existingBlock.loc.end.offset, content)
      } else {
        newVueContent = vueContent
      }

      await writeFile(finalFile, newVueContent)
    }
  }
}
