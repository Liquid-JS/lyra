import * as path from 'path'
import { Tree } from '@angular-devkit/schematics'
import { SchematicTestRunner } from '@angular-devkit/schematics/testing'

const collectionPath = path.join(import.meta.dirname, '../collection.json')

describe('new-component', () => {
    it('works', async () => {
        const runner = new SchematicTestRunner('schematics', collectionPath)
        const tree = await runner.runSchematic('new-component', {}, Tree.empty())
        expect(tree.files).toEqual([])
    })
})
