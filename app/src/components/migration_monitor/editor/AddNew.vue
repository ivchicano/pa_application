<template>
  <div :id="$options.name" class="q-pa-md">
    <router-link :to="'#'+$options.name">
      <h5 @click="onClickTitle()">{{$options.name}}</h5>
    </router-link>
    <div style="text-align:center;padding-top:30px">
      <div
        class="q-pa-lg"
        style="display:inline-block; border-width:1px; border-color:#0f3a5d; border-radius: 1.95rem;border-style: solid; padding-top:0px; width:750px;"
      >
        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Chart title</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-input bg-color="grey-3" dense rounded standout outlined v-model="title" />
          </div>
        </div>
        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Category</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-input bg-color="grey-3" dense rounded standout outlined v-model="category" />
          </div>
        </div>
        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Chart type</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-select v-model="type" rounded standout :options="types" label @input="onInput" />
          </div>
        </div>
        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Board</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-input bg-color="grey-3" dense rounded standout outlined v-model="board" />
          </div>
        </div>
        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">x axis</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-input bg-color="grey-3" dense rounded standout outlined v-model="x" />
          </div>
        </div>
        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">y axis</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-input bg-color="grey-3" dense rounded standout outlined v-model="y" />
          </div>
        </div>

        <div class="row" style="padding-bottom:15px;padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Chart description</h5>
          </div>
          <div class="col-8" style="display: block;">
            <q-input
              type="textarea"
              bg-color="grey-3"
              rounded
              standout
              outlined
              v-model="description"
            />
          </div>
        </div>

        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">X axis is unix-timestamp</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-checkbox color="accent" v-model="xistime" clickable />
          </div>
        </div>

        <div class="q-pa-xsm row" style="text-align:center; padding-right:45px">
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Data format</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-select
              v-model="data_format"
              rounded
              standout
              :options="formats"
              label="Standard"
              @input="onInput"
            />
          </div>
        </div>
        <div
          v-if="data_format === 'csv'"
          class="q-pa-xsm row"
          style="text-align:center;padding-right:45px"
        >
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Choose csv</h5>
          </div>
          <div class="col-6" style="margin: auto;display: block;">
            <q-file @input="getFiles" bg-color="grey-3" dense rounded standout outlined></q-file>
          </div>
          <div class="col" style="width:150px; height:100px: padding-right:45px; padding-left:15px">
            <!-- <q-img
              :src="myimage"
              spinner-color="white"
              style="max-height: 100px; max-width: 150px"
              @click="hotimage = true"
            />-->
            <q-dialog>
              <q-card>
                <!-- <v-hotspot
                  :init-options="hotspotConfig"
                  @save-data="saveData"
                  @after-delete="afterDelete"
                />-->
              </q-card>
            </q-dialog>
          </div>
        </div>

        <div
          v-if="data_format === 'JSON'"
          class="q-pa-xsm row"
          style="text-align:center;padding-right:45px"
        >
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">Choose JSON</h5>
          </div>
          <div class="col-6" style="margin: auto;display: block;">
            <q-file @input="getFiles" bg-color="grey-3" dense rounded standout outlined></q-file>
          </div>
          <div class="col" style="width:150px; height:100px: padding-right:45px; padding-left:15px">
            <!-- <q-img
              :src="myimage"
              spinner-color="white"
              style="max-height: 100px; max-width: 150px"
              @click="hotimage = true"
            />-->
            <q-dialog>
              <q-card>
                <!-- <v-hotspot
                  :init-options="hotspotConfig"
                  @save-data="saveData"
                  @after-delete="afterDelete"
                />-->
              </q-card>
            </q-dialog>
          </div>
        </div>

        <div
          v-if="data_format === 'API'"
          class="q-pa-xsm row"
          style="text-align:center; padding-right:45px"
        >
          <div class="col-4" style="padding-left:40px;">
            <h5 style="text-align:left;font-size:18px">API address</h5>
          </div>
          <div class="col-8" style="margin: auto;display: block;">
            <q-input bg-color="grey-3" dense rounded standout outlined v-model="url" />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="q-pa-md col-6" style="text-align:right">
          <q-btn
            color="accent"
            unelevated
            rounded
            label="Cancel"
            style="width:100px"
            @click="reset()"
            to="/situation/editor"
          />
        </div>
        <div class="q-pa-md col-6" style="text-align:left">
          <q-btn
            color="info"
            unelevated
            rounded
            label="Save/Update"
            style="width:150px"
            @click="addChart()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddNewChart",

  data() {
    return {
      title: "",
      description: "",
      x: "",
      y: "",
      url: "",
      xistime: false,
      data_format: "JSON",
      formats: ["JSON", "csv", "API"],
      category: "",
      type: "",
      types: ["BAR", "LINE", "PIE"],
      board: "",
      content: null,
    };
  },
  computed: {
    categories() {
      return this.$store.state.statistics.categories.map((c) => c.category);
    },
  },
  methods: {
    addChart: function () {
      const data = {
        title: this.title,
        content: this.content,
        description: this.description,
        category: this.category,
        format: this.data_format,
        type: this.type,
        xistime: this.xistime,
        x: this.x,
        y: this.y,
        board: this.board,
      };
      this.$store
        .dispatch("statistics/addChart", data)
        .then(() => {
          this.$q.dialog({
            message: 'upload succeeds, please refresh to see new charts',
          });
          // this.$router.push("/situation/editor");
        })
        .catch((err) => {
          this.$q.dialog({
            message: err,
          });
        });
    },
    reset: function () {
      this.title = "";
      this.description = "";
      this.x = "";
      this.y = "";
      this.url = "";
      this.xistime = false;
      this.data_format = "JSON";
      this.category = "";
      this.type = "";
      this.board = "";
      this.content = null;
    },
    onInput: function (e) {
      console.log("Change: ", e);
    },
    getFiles(file) {
      let reader = new FileReader();
      // Convert the file to base64 text
      // reader.readAsDataURL(file);
      reader.readAsText(file);
      console.log(file);

      reader.onload = () => {
        // Make a fileInfo Object
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + " kB",
          result: reader.result,
          file: file,
        };
        console.log(fileInfo.result);
        this.content = fileInfo.result;
      };
    },
  },
};
</script>
<style scoped>
</style>
