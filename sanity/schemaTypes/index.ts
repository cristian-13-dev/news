import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {barChart} from './barChart'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {tableType} from './tableType'
import {videoType} from './videoType'
import {comparisonType} from './comparisonType'
import {prosConsType} from './prosConsType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, tableType, videoType, comparisonType, prosConsType, barChart],
}
