<template>
  <div>
    <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{title}}</div>
    <div class="row">
      <div class="col q-mt-md q-ml-md">
        <q-list
          bordered
          v-if="tags_enabled || categories_enabled"
        >
          <q-item>
            <q-item-section>
              <q-item-label class="title-label">Filter</q-item-label>
            </q-item-section>
            <q-item-section>
              <a
                href="javascript:void(0)"
                @click="clearFilters()"
              >
                Clear all filters
              </a>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="tags_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="title-label">Tags</q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="tag in filterTags"
              :key="tag"
            >
              <q-checkbox
                color="accent"
                v-model="selectedTags"
                :val="tag"
                :label="tag"
                class="filter-text"
                @input="filterByTags()"
              />
            </q-item>
            <q-item>
              <a
                href="javascript:void(0)"
                class="filter-text"
                @click="showMoreTags()"
              >
                Show more
              </a>
            </q-item>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            expand-separator
            v-if="categories_enabled"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="title-label">Category</q-item-label>
              </q-item-section>
            </template>
            <q-item
              v-for="category in filterCategories"
              :key="category.id"
            >
              <q-radio
                color="accent"
                v-model="selectedCategory"
                :val="category"
                :label="category.category"
                @input="filterByCategory()"
                class="filter-text"
              />
            </q-item>
            <q-item>
              <a
                href="javascript:void(0)"
                class="filter-text"
                @click="showMoreCategories()"
              >
                Show more
              </a>
            </q-item>
          </q-expansion-item>
        </q-list>
      </div>
      <div class="q-mx-sm col-10">
        <div class="q-my-md q-mr-md row">
          <q-input
            color="accent"
            v-model="search"
            debounce="500"
            filled
            outlined
            label="Search"
            class="col-10"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            outlined
            no-caps
            label="Categories"
            class="add-btn col q-ml-md"
            :to="categories_url"
            v-if="categories_enabled"
          />
          <q-btn
            outlined
            no-caps
            :label="add_label"
            class="add-btn col q-ml-md"
            :to="new_url"
          />
        </div>
        <div class="row">
          <q-list class="q-mt-md col-11 element-list">
            <!-- column title -->
            <q-item v-if="publish_mode || categories_enabled || tags_enabled">
              <q-item-section
                class="publish_section"
                v-if="publish_mode"
              >
                Published
              </q-item-section>
              <q-item-section
                class="col_title_section"
                v-if="publish_mode"
              />
              <q-item-section
                class="publish_section"
                v-if="categories_enabled"
              >
                Category
              </q-item-section>
              <q-item-section
                class="publish_section"
                v-if="tags_enabled"
              >
                Tag
              </q-item-section>
            </q-item>
            <q-separator v-if="publish_mode || categories_enabled || tags_enabled" />
            <!-- items -->
            <q-item
              v-for="item in filteredElements"
              :key="item.id"
              :id="item.id"
              clickable
              @mouseover="hovered = item.id"
              @mouseleave="hovered = -1"
            >
              <q-item-section
                avatar
                v-if="publish_mode"
                class="publish_section"
              >
                <q-checkbox
                  color="accent"
                  :value="publishState[item.id]"
                  @input="updatePublish($event, item)"
                />
              </q-item-section>
              <q-item-section class="title_section">
                <q-item-label :class="
                !publish_mode || publishState[item.id]
                  ? 'published title-label'
                  : 'unpublished title-label'
              ">
                  {{ item.title }}
                </q-item-label>
                <glossary-editor-viewer
                  :class="
                    !publish_mode || publishState[item.id]
                      ? 'published'
                      : 'unpublished'
                  "
                  :content="item.description"
                  v-if="!loading"
                  glossary_fetched
                  :lang="lang"
                />
              </q-item-section>
              <q-item-section
                class="category_section"
                v-if="categories_enabled"
              >
                {{item.category.category}}
              </q-item-section>
              <q-item-section class="tag_btn_section">
                <q-btn
                  no-caps
                  v-for="tag in item.tags"
                  :key="tag.id"
                  :label="tag.tag"
                  class="q-mb-sm tag_btn"
                />
              </q-item-section>
              <q-item-section
                side
                :style="{ visibility: hovered === item.id ? 'visible' : 'hidden' }"
                class="icon_btn_section"
              >
                <q-btn
                  round
                  class="item-btn"
                  icon="img:statics/icons/MICADO-Edit Icon - Black (600x600) transparent.png"
                  :to="edit_url_fn(item.id)"
                />
                <br>
                <q-btn
                  round
                  class="item-btn"
                  icon="img:statics/icons/MICADO Delete Icon - Black (600x600) transparent.png"
                  @click="delete_fn(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-ml-sm q-mt-md col">
            <span
              v-for="(letter, index) in alphabet"
              :key="letter"
              class="row alphabet"
              @click="scrollIntoElement(index)"
            >
              {{letter}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Fuse from "fuse.js";
import GlossaryEditorViewer from "./GlossaryEditorViewer";
export default {
  name: "ListSearchTags",
  props: {
    elements: {
      type: Array,
      default: function () {
        return [];
      }
    },
    new_url: {
      type: String,
      default: "/"
    },
    edit_url_fn: {
      type: Function,
      default: function () {
        return () => "/";
      }
    },
    delete_fn: {
      type: Function,
      default: function () {
        return () => "";
      }
    },
    title: {
      type: String,
      default: ""
    },
    icon_name: {
      type: String,
      default: ""
    },
    add_label: {
      type: String,
      default: "Add"
    },
    publish_mode: {
      type: Boolean,
      default: false
    },
    update_publish_fn: {
      type: Function,
      default: function () {
        return () => "/";
      }
    },
    categories_enabled: {
      type: Boolean,
      default: false
    },
    categories_url: {
      type: String,
      default: "/"
    },
    tags_enabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovered: -1,
      // display only elements in the language selected
      translatedElements: [],
      filteredElementsBySearch: [],
      filteredElementsByTags: [],
      filteredElementsByCategory: [],
      searchText: "",
      tags: [],
      translatedCategories: [],
      selectedTags: [],
      selectedCategory: undefined,
      publishState: {},
      lang: "",
      alphabet: [],
      alphabetIds: [],
      lastIndexTags: 5,
      lastIndexCategories: 5,
      loading: true
    };
  },
  components: {
    "glossary-editor-viewer": GlossaryEditorViewer
  },
  methods: {
    ...mapActions("glossary", ["fetchGlossary"]),
    addOrRemoveSelectedCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = undefined
      } else {
        this.selectedCategory = category
      }
      this.filterByCategory();
    },
    filterByTags() {
      if (this.selectedTags.length > 0) {
        this.filteredElementsByTags = [];
        for (let e of this.translatedElements) {
          let matchedTags = []
          for (let tag of this.selectedTags) {
            if (e.tags) {
              for (let elemTag of e.tags) {
                if (elemTag.tag === tag) {
                  // This check avoids duplicate matches
                  if (matchedTags.indexOf(tag) == -1) {
                    matchedTags.push(tag)
                  }
                }
              }
            }
          }
          if (matchedTags.length == this.selectedTags.length) {
            this.filteredElementsByTags.push(e)
          }
        }
      } else {
        this.filteredElementsByTags = this.translatedElements;
      }
    },
    filterByCategory() {
      if (this.selectedCategory) {
        this.filteredElementsByCategory = this.translatedElements.filter(e => {
          if (e.category !== this.selectedCategory) {
            return false;
          }
          return true;
        });
      } else {
        this.filteredElementsByCategory = this.translatedElements;
      }
    },
    updatePublish(newValue, item) {
      this.update_publish_fn({ id: item.id, published: newValue }).then(() => {
        this.publishState[item.id] = newValue;
      });
    },
    compare(a, b) {
      return a.title.localeCompare(b.title, this.$userLang, { sensitivity: "base" })
    },
    scrollIntoElement(index) {
      document.getElementById(this.alphabetIds[index]).scrollIntoView()
    },
    clearFilters() {
      this.selectedTags = [];
      this.selectedCategory = undefined;
      this.filteredElementsByTags = this.translatedElements;
      this.filteredElementsByCategory = this.translatedElements;
    },
    showMoreTags() {
      this.lastIndexTags += 5;
    },
    showMoreCategories() {
      this.lastIndexCategories += 5;
    }
  },
  computed: {
    search: {
      get() {
        return this.searchText;
      },
      set(newSearch) {
        if (newSearch) {
          const fuse = new Fuse(this.translatedElements, {
            keys: ["title"]
          });
          this.filteredElementsBySearch = fuse
            .search(newSearch)
            .map(i => i.item);
          this.searchText = newSearch;
        } else {
          this.filteredElementsBySearch = this.translatedElements;
          this.searchText = "";
        }
      }
    },
    filteredElements() {
      var filteredElementsByTags = this.filteredElementsByTags;
      var filteredElementsByCategory = this.filteredElementsByCategory;
      return this.filteredElementsBySearch.filter(function (n) {
        return filteredElementsByTags.indexOf(n) !== -1 && filteredElementsByCategory.indexOf(n) !== -1;
      });
    },
    filterTags() {
      return this.tags.slice(0, this.lastIndexTags)
    },
    filterCategories() {
      return this.translatedCategories.slice(0, this.lastIndexCategories)
    },
  },
  created() {
    this.loading = true;
    this.lang = this.$i18n.locale
    this.fetchGlossary().then(() => {
      this.translatedElements = this.elements.map(e => {
        let idx = e.translations.findIndex(t => t.lang === this.lang);
        let translation = { ...e.translations[idx] };
        if (this.categories_enabled) {
          let idxCat = e.category.translations.findIndex(t => t.lang === this.lang);
          translation.category = e.category.translations[idxCat]
          if (this.translatedCategories.indexOf(translation.category) == -1) {
            this.translatedCategories.push(translation.category)
          }
        }
        if (this.tags_enabled) {
          // Tags
          if (e.tags.length > 0) {
            let tagTranslations = []
            for (let tag of e.tags) {
              let translations = tag.translations.filter(tag => tag.lang === this.lang)
              if (translations.length > 0) {
                tagTranslations.push(translations[0])
                if (this.tags.indexOf(translations[0].tag) == -1) {
                  this.tags.push(translations[0].tag);
                }
              }
            }
            translation.tags = tagTranslations
          }
        }
        if (this.publish_mode) {
          // Publish
          this.publishState[e.id] = e.published;
        }
        return translation
      });
      this.translatedElements.sort(this.compare)
      for (let elem of this.translatedElements) {
        let firstChar = elem.title.charAt(0).toUpperCase()
        if (!this.alphabet.includes(firstChar)) {
          this.alphabet.push(firstChar)
          this.alphabetIds.push(elem.id)
        }
      }
      this.filteredElementsBySearch = this.translatedElements;
      this.filteredElementsByTags = this.translatedElements;
      this.filteredElementsByCategory = this.translatedElements;
      this.loading = false;
    });
  }
};
</script>

<style lang="scss" scoped>
$accent_list: #ff7c44;
$btn_secondary: #cdd0d2;
.add-btn {
  color: $accent_list;
  border: 1px solid $accent_list;
  border-radius: 2px;
}
.toolbar-list {
  background-color: $accent_list;
  border-radius: 2px;
}
.title-label {
  font-weight: bold;
  font-family: "Nunito";
  font-size: 15pt;
}
.item-btn {
  background-color: $btn_secondary;
}
.tag_btn {
  background-color: $primary;
  color: white;
}
.category_btn {
  background-color: $btn_secondary;
  text-decoration: underline;
  border: 1px solid $accent_list;
}
.published {
  opacity: 1;
}
.unpublished {
  opacity: 0.5;
}
.publish_section {
  flex: 500;
}
.title_section {
  flex: 3000;
}
.tag_btn_section {
  flex: 1000;
}
.category_section {
  flex: 1500;
}
.icon_btn_section {
  flex: 350;
}
.col_title_section {
  flex: 650;
}
.alphabet {
  color: $primary;
  font-family: "Nunito";
  font-weight: bold;
  cursor: pointer;
}
.filter-text {
  font-family: "Nunito";
  font-weight: normal;
}
.element-list {
  overflow-y: scroll;
  max-height: 75vh;
}
</style>
