import { PROJECT_ACTIVE, POST_TYPE, POST_PUBLISH_STATUS } from 'api/config'
import { get, map, remove } from 'lodash'
const type_options = map(POST_TYPE, (s, k) => {
  return { name: k, value: s, }
})
const fetchSource = store => {
  return store.dispatch('FETCH_LIST', {
    params: {
      maxResult: 500,
      sort: '-updated_at',
    },
    endpoint: 'project',
  }).then(res => {
    return map(get(res, 'items', []), item => ({ id: item.id, text: item.title, }))
  })
}
const tagsAutoComplete = (store, keyword) => {
  return store.dispatch('FETCH_AUTOCOMPLETE_LIST', {
    params: {
      maxResult: 20,
      keyword,
      sort: '-updated_at',
    },
    endpoint: 'tags',
  })
}
const publish_status_options = map(POST_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const active_options = map(PROJECT_ACTIVE, (s, k) => {
  return { name: k, value: s, }
})
const authorAutoComplete = (store, keyword) => {
  return store.dispatch('FETCH_AUTOCOMPLETE_LIST', {
    params: {
      maxResult: 500,
      keyword,
    },
    endpoint: 'members/nickname',
  })
}
const typeOpts = (store, { vueInstance }) => new Promise(resolve => {
  const opts = map(POST_TYPE, (v, k) => ({ id: v, text: vueInstance.$t(`POST.TYPE_${k}`), }))
  remove(opts, opt => opt.id === 2 || opt.id === 3)
  resolve(opts)
})

const isSupposedToShowWithTypeExcludeCard = data => get(data, 'type') != POST_TYPE.CARD
const isSupposedToShowWithTypeCard = data => get(data, 'type') == POST_TYPE.CARD
const isSupposedToShowWithTypeReport = data => get(data, 'type') == POST_TYPE.REPORT
const isSupposedToShowWithTypeReview = data => { return get(data, 'type') == POST_TYPE.REVIEW }
const isSupposedToShowWithTypeNewsOrReview = data => { return get(data, 'type') == POST_TYPE.NEWS || get(data, 'type') == POST_TYPE.REVIEW }

export const model = [
  { name: 'id', type: 'TextInput', group: 'info', listWidth: { min: '100', }, isEditable: false, isListable: true, isEditEntry: true, order: { list: 0 }, },
  { name: 'publishStatus', type: 'RadioItem', group: 'info', listWidth: { min: '94' }, isEditable: false, isListable: true, options: publish_status_options, isButtonized: true, isSchedulable: true, order: { list: 3 },  },
  { name: 'updatedAt', type: 'Datetime', group: 'info', listWidth: { min: '140' }, isEditable: false, isListable: true, isDatetimeSentitive: true, order: { list: 4 }, },
  { name: 'createdAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, },
  { name: 'publishedAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, isButtonizedWith: true, },
  { name: 'updatedBy', type: 'TextInput', group: 'info', isEditable: false, isListable: false, isHidden: true, },

  { name: 'type', type: 'Dropdownlist', group: 'basic', listWidth: { min: '60' }, isEditable: true, isListable: true, isNumSentitive: true, options: type_options, fetchSource: typeOpts, required: true, order: { list: 2 }, },
  { name: 'projectId', type: 'Dropdownlist', group: 'basic', isEditable: true, isListable: false, isNumSentitive: true, fetchSource, default: '0', defaultText: 'NA' },
  { name: 'author', type: 'TextTagItem', group: 'basic', listWidth: { min: '130', max: '200' }, isEditable: false, isListable: true, isHidden: true, map: { name: 'nickname', value: 'id',  }, autocomplete: authorAutoComplete, order: { list: 1 }, },
  { name: 'authors', type: 'TextTagItem', group: 'basic', listWidth: { min: '130', max: '200' }, isEditable: true, isListable: false, map: { name: 'nickname', value: 'id',  }, autocomplete: authorAutoComplete, order: { list: 1 }, },
  { name: 'postOrder', type: 'TextInput', group: 'basic', isEditable: true, isListable: false, isNumSentitive: true, },

  { name: 'title', type: 'TextInput', group: 'content', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, order: { list: 1.5, editor: 1 }, required: true, },
  // For post.type === news || review || report || memo
  { name: 'content', type: 'ContentEditor', group: 'content', isEditable: true, isListable: false, order: { editor: 2 }, watcher: 'type', showWith: isSupposedToShowWithTypeExcludeCard },

  // For post.type === review
  { name: 'link', type: 'TextInput', group: 'content', isEditable: true, isListable: false, isHidden: false, watcher: 'type', showWith: isSupposedToShowWithTypeReview, },

  // For post.type === report
  // { name: 'description', type: 'TextareaInput', group: 'content', isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, order: { editor: 1.5 }, watcher: 'type', showWith: isSupposedToShowWithTypeReport,},
  { name: 'heroImage', type: 'AssetPicker', group: 'content', listWidth: { min: '180', max: '180' }, isEditable: true, isListable: false, watcher: 'type', showWith: isSupposedToShowWithTypeReport, acceptedFileTypes: [ 'image/*' ], },
  { name: 'slug', type: 'TextInput', group: 'content', isEditable: true, isListable: false, watcher: 'type', showWith: isSupposedToShowWithTypeReport, },

  // For post.type === news || review
  { name: 'tags', type: 'TextTagItem', group: 'content', isEditable: true, isListable: false, map: { name: 'text', value: 'id', isValArraySensitive: true, }, autocomplete: tagsAutoComplete, showWith: isSupposedToShowWithTypeNewsOrReview, },
  
  // For post.type === card
  { name: 'narrative', type: 'TextareaInput', group: 'content', isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, showWith: isSupposedToShowWithTypeCard },
  { name: 'cards', type: 'ContentOptions', group: 'content', isEditable: true, isListable: false, isHidden: false, default: [], showWith: isSupposedToShowWithTypeCard },

  { name: 'css', type: 'TextareaInput', group: 'custom', isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, showWith: isSupposedToShowWithTypeCard },
  { name: 'javascript', type: 'TextareaInput', group: 'custom', isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, showWith: isSupposedToShowWithTypeCard },

  // For post.type === news
  { name: 'ogTitle', type: 'TextInput', group: 'share', isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, },
  { name: 'ogDescription', type: 'TextareaInput', group: 'share', isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, },
  { name: 'ogImage', type: 'AssetPicker', group: 'share', isEditable: true, isListable: false, acceptedFileTypes: [ 'image/*' ], },

]

export const groups = [ 'info', 'basic', 'content', 'custom', 'share' ]
export const isPreviewable = true
export const previewHost = 'https://www.readr.tw/post'
export const LIST_MAXRESULT = 15
export const isSearchable = false
export const filters = [
  { name: 'title', type: 'TextInput' },
  { name: 'content', type: 'TextInput' },
  { name: 'author', type: 'TextInput' },
  { name: 'tags', type: 'TextInput' },
  { name: 'id', type: 'TextInput' },
  { name: 'publishStatus', type: 'Datetime' },
  { name: 'createdAt', type: 'Datetime' },
  { name: 'updatedAt', type: 'Datetime' },
]