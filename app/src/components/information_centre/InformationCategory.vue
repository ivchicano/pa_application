<template>
  <div :id="$options.name">
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">Information Centre - Categories</div>
    <span v-if="errorMessage">{{errorMessage}}</span>
    <q-list
      bordered
      separator
      class="q-pa-md"
    >
      <q-item
        clickable
        v-ripple
        v-for="a_information_category in information_category"
        :key="a_information_category.id"
      >
        <q-item-section>{{showCategoryLabel(a_information_category)}}</q-item-section>
        <q-item-section
          side
          class="icon_btn_section"
        >
          <q-btn
            round
            class="item-btn"
            icon="img:statics/icons/MICADO-Edit Icon - Black (600x600) transparent.png"
            @click="deleteInformationCategory(a_information_category.id)"
          />
        </q-item-section>
        <q-item-section
          side
          class="icon_btn_section"
        >
          <q-btn
            round
            class="item-btn"
            icon="img:statics/icons/MICADO Delete Icon - Black (600x600) transparent.png"
            @click="editInformationCategory(a_information_category)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-card class="my-card">
      <q-card-section align="center">
        <q-btn
          class="q-mr-sm"
          outline
          color="accent"
          :label="$t('button.go_back')"
          @click="$router.go(-1)"
          :disable="hideAdd"
        />
        <q-btn
          color="accent"
          :label="$t('button.add')"
          @click="newInformationCategory()"
          :disable="hideAdd"
        />
      </q-card-section>
      <q-card-section :hidden="hideForm">
        <q-tabs
          v-model="langTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="language in languages"
            :key="language.lang"
            :name="language.name"
            :label="language.name"
          />
        </q-tabs>
        <q-tab-panels
          v-model="langTab"
          animated
        >
          <q-tab-panel
            v-for="language in languages"
            :key="language.lang"
            :name="language.name"
          >
            <q-input
              v-model="int_cat_shell.translations.filter(filterTranslationModel(language.lang))[0].eventCategory"
              :label="$t('input_labels.event')"
            />
          </q-tab-panel>
        </q-tab-panels>
        <div>
          <q-checkbox
            color="accent"
            v-model="linkable"
            :label="$t('input_labels.event_checkbox')"
          />
        </div>
        <div align="center">
          <q-btn
            class="button q-mr-sm"
            unelevated
            rounded
            style="width:70px;border-radius:2px"
            :label="$t('button.cancel')"
            @click="cancelInformationCategory()"
          />
          <q-btn
            color="accent"
            unelevated
            rounded
            style="width:70px;border-radius:2px"
            :label="$t('button.save')"
            @click="saveInformationCategory()"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import editEntityMixin from '../../mixin/editEntityMixin'

export default {
  name: "InformationCategory",
  mixins: [editEntityMixin],
  data() {
    return {
      int_cat_shell: { id: -1, translations: [] },
      hideForm: true,
      hideAdd: false,
      isNew: false,
      linkable: false,
      errorMessage: ""
    };
  },
  computed: {
    information_category() {
      return this.$store.state.information_category.information_category;
    }
  },
  methods: {
    onClickTitle: function () {
      this.$emit("scroll", "#" + this.$options.name);
    },
    deleteInformationCategory(index) {
      this.$store.dispatch(
        "information_category/deleteInformationCategory",
        index
      ).catch(() => {
        this.errorMessage = "Cannot delete a category when an item has this category"
      });
    },
    showCategoryLabel(workingCat) {

      return workingCat.translations.filter(this.filterTranslationModel(this.activeLanguage))[0].eventCategory
    },
    saveInformationCategory() {

      let content = { link_integration_plan: this.linkable, ...this.int_cat_shell }
      if (this.isNew) {
        // we are adding a new instance
        this.$store
          .dispatch(
            "information_category/saveInformationCategory",
            content
          )
      } else {
        // we are updating the exsisting
        this.$store
          .dispatch(
            "information_category/editCategoryTypeElement",
            content
          )
      }
      this.linkable = false
      this.hideForm = true;
      this.createShell()
    },
    newInformationCategory() {
      this.isNew = true;
      this.hideForm = false;
      this.hideAdd = true;
    },
    cancelInformationCategory() {
      this.isNew = false;
      this.hideForm = true;
      this.hideAdd = false;
      this.linkable = false
    },
    editInformationCategory(information_category) {
      this.isNew = false;
      this.hideForm = false;
      this.linkable = information_category.link_integration_plan
      //this.int_cat_shell = JSON.parse(JSON.stringify(information_category));
      this.mergeCategory(information_category)
    },
    createShell() {
      this.int_cat_shell = { id: -1, translations: [] }
      this.languages.forEach(l => {
        //       console.log(l)
        this.int_cat_shell.translations.push({ id: -1, lang: l.lang, eventCategory: '', translationDate: null })
      });
    },
    mergeCategory(category) {
      this.int_cat_shell.id = category.id
      category.translations.forEach(tr => {
        //    this.int_topic_shell.translations.filter(function(sh){return sh.lang == tr.lang})

        for (var i = 0; i < this.int_cat_shell.translations.length; i++) {
          if (this.int_cat_shell.translations[i].lang == tr.lang) {
            this.int_cat_shell.translations.splice(i, 1);
            this.int_cat_shell.translations.push(JSON.parse(JSON.stringify(tr)))
            break;
          }
        }
      });

    },
  },
  //store.commit('increment', 10)
  created() {
    this.createShell()
    this.loading = true;
    this.$store
      .dispatch("information_category/fetchInformationCategory")
      .then(processes => {
        this.loading = false;
      });

  }
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: #000000;
}
.button {
  background-color: white;
  color: black;
  border: 1px solid #c71f40;
}
</style>
