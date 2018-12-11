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

const isSupposedToShowWithTypeReport = data => get(data, 'type') == POST_TYPE.REPORT
const isSupposedToShowWithTypeReview = data => { return get(data, 'type') == POST_TYPE.REVIEW }
const isSupposedToShowWithTypeNewsOrReview = data => { return get(data, 'type') == POST_TYPE.NEWS || get(data, 'type') == POST_TYPE.REVIEW }

export const model = [
  { name: 'id', type: 'TextInput', group: 'info', width: { list: '80', editor: '500' }, isEditable: false, isListable: true, isEditEntry: true, },
  { name: 'publishStatus', type: 'RadioItem', group: 'info', width: { list: '70', editor: '400' }, isEditable: false, isListable: true, options: publish_status_options, isButtonized: true,  },
  { name: 'updatedAt', type: 'Datetime', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, },
  { name: 'createdAt', type: 'Datetime', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, },
  { name: 'publishedAt', type: 'Datetime', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, isButtonizedWith: true, },
  { name: 'updatedBy', type: 'TextInput', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },

  { name: 'type', type: 'Dropdownlist', group: 'basic', width: { list: '50', editor: '400' }, isEditable: true, isListable: true, options: type_options, fetchSource: typeOpts, required: true, },
  { name: 'authors', type: 'TextTagItem', group: 'basic', width: { list: '80', editor: '400' }, isEditable: true, isListable: false, map: { name: 'nickname', value: 'id',  }, autocomplete: authorAutoComplete, },
  { name: 'postOrder', type: 'TextInput', group: 'basic', width: { list: '50', editor: '80' }, isEditable: true, isListable: false, isNumSentitive: true, },

  { name: 'title', type: 'TextInput', group: 'content', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, },
  { name: 'projectId', type: 'Dropdownlist', group: 'content', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, isNumSentitive: true, fetchSource, default: '0', defaultText: 'NA' },
  { name: 'content', type: 'ContentEditor', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, },

  // For post.type === review
  { name: 'link', type: 'TextInput', group: 'content', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isHidden: false, watcher: 'type', showWith: isSupposedToShowWithTypeReview, },

  // For post.type === report
  { name: 'heroImage', type: 'Image', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, watcher: 'type', showWith: isSupposedToShowWithTypeReport, },
  { name: 'slug', type: 'TextInput', group: 'content', width: { list: '110', editor: '400' }, isEditable: true, isListable: false, watcher: 'type', showWith: isSupposedToShowWithTypeReport, },


  // For post.type === news || review
  { name: 'tags', type: 'TextTagItem', group: 'content', width: { list: '80', editor: '400' }, isEditable: true, isListable: false, map: { name: 'text', value: 'id', isValArraySensitive: true, }, autocomplete: tagsAutoComplete, showWith: isSupposedToShowWithTypeNewsOrReview, },
  
  // For post.type === news
  { name: 'ogTitle', type: 'TextInput', group: 'share', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, },
  { name: 'ogDescription', type: 'TextareaInput', group: 'share', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, },
  { name: 'ogImage', type: 'Image', group: 'share', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, autoHeightActive: true, },

]

export const groups = [ 'info', 'basic', 'content', 'share' ]