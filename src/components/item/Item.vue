<template>
  <div v-if="isMounted && (itemObj.isEditable || (itemObj.isInitialiazible && editorMode === 'create'))" class="editor-item">
    <TextInput v-if="itemObj.type === 'TextInput'"
      backgroundColor="#fff"
      :placeHolder="$t(`${modelName}.${decamelize(itemObj.name).toUpperCase()}`)"
      :isWarned="isWarned"
      :value.sync="value"></TextInput>
    <DatetimeItem v-else-if="itemObj.type === 'Datetime'"
      :relativeToRef="itemObj.relativeToWatcher"
      :dateRef="refVals[ itemObj.watcher ]"
      :datetimeType="itemObj.datetimeType"
      :value.sync="value"></DatetimeItem>
    <TextareaInput v-else-if="itemObj.type === 'TextareaInput'"
      :autoHeightActive="itemObj.autoHeightActive"
      :placeholder="$t(`${modelName}.${decamelize(itemObj.name).toUpperCase()}`)"
      :value.sync="value"></TextareaInput>
    <template v-else-if="itemObj.type === 'RadioItem'">
      <RadioItem v-for="opt in itemObj.options" :name="get(itemObj, 'name')"
        @updateForm="updateForm"
        :label="$t(`${modelName}.${decamelize(itemObj.name).toUpperCase()}_${opt.name}`)"
        :key="get(opt, 'name')"
        :value="get(opt, 'value')"
        :currSelected.sync="value"></RadioItem>
    </template>
    <QuillEditor v-else-if="itemObj.type === 'ContentEditor'" :content.sync="value" />
    <TextTagItem v-else-if="itemObj.type === 'TextTagItem'"
      :placeholder="$t(`${modelName}.${decamelize(itemObj.name).toUpperCase()}`)"
      :currTagValues.sync="value"
      :currInput.sync="currTagInput"
      :autocomplete="autocompleteArr"></TextTagItem>
    <BooleanSwitcher v-else-if="itemObj.type === 'BooleanSwitcher'"
      :status.sync="value"></BooleanSwitcher>
    <Dropdownlist v-else-if="itemObj.type === 'Dropdownlist'"
      :isWarned="isWarned"
      :name="itemObj.name"
      :defaultVal="itemObj.default"
      :defaultText="itemObj.defaultText"
      :fetchSource="itemObj.fetchSource"
      :selectedItem.sync="value"></Dropdownlist>
    <MediaOptions v-else-if="itemObj.type === 'MediaOptions'"
      :fetchData="itemObj.fetchData"
      :id="refVals[ 'id' ]"
      :options.sync="value"></MediaOptions>
    <ContentOptions v-else-if="itemObj.type === 'ContentOptions'"
      :fetchData="itemObj.fetchData"
      :id="refVals[ 'id' ]"
      :options.sync="value"></ContentOptions>
    <CheckboxItem v-else-if="itemObj.type === 'CheckboxItem'"
      theme="editor"
      :text="$t(`${modelName}.${itemObj.subText}`)"
      :value.sync="value"></CheckboxItem>
    <Uploader v-else-if="itemObj.type === 'Uploader'"
      :acceptedFileTypes="itemObj.acceptedFileTypes"
      :destination="refVals[ 'destination' ]"
      :fileExt="refVals[ 'fileExtension' ]"
      :fileObj.sync="value"></Uploader>
    <AssetPicker v-else-if="itemObj.type === 'AssetPicker'"
      :isWarned="isWarned"
      :value.sync="value"></AssetPicker>
  </div>
  <div v-else>
    <span v-if="itemObj.type === 'RadioItem'" v-text="mapValue(itemObj.name, itemObj.options, itemVal)"></span>
    <span v-else-if="itemObj.type === 'Datetime'" v-text="moment(itemVal).format('YYYY-MM-DD HH:mm:ss')"></span>
    <span v-else v-text="itemVal"></span>
  </div>
</template>
<script>
  import AssetPicker from 'src/components/form/AssetPicker/AssetPicker.vue'
  import BooleanSwitcher from 'src/components/form/BooleanSwitcher.vue'
  import ButtunizedItem from 'src/components/form/ButtunizedItem.vue'
  import CheckboxItem from 'src/components/form/CheckboxItem.vue'
  import ContentOptions from 'src/components/form/ContentOptions.vue'
  import DatetimeItem from 'src/components/form/DatetimeItem.vue'
  import Dropdownlist from 'src/components/form/Dropdownlist.vue'
  import ItemEditorLayout from 'src/components/item/ItemEditorLayout.vue'
  import MediaOptions from 'src/components/form/MediaOptions.vue'
  import RadioItem from 'src/components/form/RadioItem.vue'
  import QuillEditor from 'src/components/form/Quill/QuillEditor.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextInput from 'src/components/form/TextInput.vue'
  import TextareaInput from 'src/components/form/TextareaInput.vue'
  import TextTagItem from 'src/components/form/TextTagItem.vue'
  import Uploader from 'src/components/form/MediaUploader/Uploader.vue'
  import moment from 'moment'
  import { decamelize, } from 'humps'
  import { filter, get, map } from 'lodash'
  const debug = require('debug')('CLIENT:Item')
  const setupDataMutationState = (store, status) => store.dispatch('UPDATE_EDITOR_MUTATION_STATE', { status })
  export default {
    name: 'Item',
    components: {
      AssetPicker,
      BooleanSwitcher,
      ButtunizedItem,
      CheckboxItem,
      ContentOptions,
      DatetimeItem,
      Dropdownlist,
      ItemEditorLayout,
      MediaOptions,
      QuillEditor,
      RadioItem,
      Spinner,
      TextareaInput,
      TextInput,
      TextTagItem,
      Uploader,      
    },
    data () {
      return {
        currTagInput: '',
        isMounted: false,
        isOriginDataSetup: false,
        value: undefined,
        autocompleteArr: [],
      }
    },
    methods: {
      decamelize,
      get,
      moment,
      mapValue (name, options, value) {
        return this.$t(`${this.modelName}.${decamelize(name).toUpperCase()}_${get(filter(options, { value, }), '0.name', 'NEVER').toUpperCase()}`, '')
      },      
      updateForm () {
        this.$emit('updateForm')
      },
    },
    mounted () {
      debug('this.itemObj.default', this.itemObj.default)
      this.value = get(this, 'itemVal') || get(this, 'itemVal') === 0 ? get(this, 'itemVal') : this.itemObj.default
      this.isMounted = true
    },
    props: {
      isWarned: {},
      itemObj: {
        type: Object,
        default: () => ({})
      },
      itemVal: {
        default: ''
      },
      refVals: {
        type: Object,
        default: () => ({})         
      },
      modelName: {
        required: true
      },
      editorMode: {
        type: String,
        default: ''
      }
    },
    watch: {
      itemVal (newVal, oldVal) {},
      value (newVal, oldVal) {
        this.$emit('update:itemVal', this.value)
        if (this.isOriginDataSetup && oldVal != newVal) {
          console.log(this.itemObj.name, `${oldVal} -> ${newVal}`)
          setupDataMutationState(this.$store, true)
        }
        !this.isOriginDataSetup && (this.isOriginDataSetup = true)
      },
      currTagInput (newValue, oldValue) {
        debug(`Mutation detected: currTagInput`)
        debug('Data changed from ', oldValue, ' to ', newValue, '!')
        if (this.itemObj.autocomplete && newValue) {
          this.itemObj.autocomplete(this.$store, newValue).then(({ items, }) => {
            const list= [
              ...map(items, a => ({
                name: get(a, get(this.itemObj, 'map.name')),
                value: get(a, get(this.itemObj, 'map.value')),
              }))
            ]
            this.autocompleteArr = list
          })
        }        
      },
      '$route.fullPath': function () {
        this.isOriginDataSetup = false
        this.value = get(this, 'itemVal') || get(this, 'itemVal') === 0 ? get(this, 'itemVal') : this.itemObj.default
        this.isMounted = true   
      }
    }
  }
</script>
<style lang="stylus" scoped></style>