  <template>
  <div >
  <div style="font-style: normal;height:72px;text-align: center; padding-top:15px;font-weight: bold;font-size: 30px;line-height: 41px;color:white; background-color:#FF7C44">{{$t('input_labels.guided_processes')}}</div>

  <div class="container">

    <div style="text-align:center;">
      <div
        class="col-10"
        style="display:inline-block;width:80%;padding-right:30px;padding-left:0px"
      >
        <q-input
          style="border-radius:10px;width:100% ;font-size:18px"
          dense
          items-center
          filled
          v-model="search"
          :label="$t('input_labels.search')"
        >
          <template v-slot:append>
            <q-avatar>
              <q-icon name="search" />
            </q-avatar>
          </template>
        </q-input>
      </div>
      <div
        class="col-2"
        style="display:inline-block;text-align:right;width:150px"
      >
        <q-btn
          style="width:150px; margin-bottom:15px;border-radius:2px"
          color="secondary"
          unelevated
          rounded
          :label="$t('button.add_process')"
          no-caps
          size="15px"
          to="guided_process_editor/edit"
        />
      </div>
    </div>
   
    <div style="text-align:center;">
    
      <q-list style="display:inline-block; width:90%; padding-top:20px;">
       
    <q-item class=" row" style="padding-left:16px; padding-bottom:0px">
    <q-item-section class="col-8 flex flex-left" style="text-align:left">
        {{$t('input_labels.name')}} 
    </q-item-section>
    <q-item-section class="col-1.3 flex flex-center" style="margin-left:30px">
       {{$t('input_labels.edit')}}
    </q-item-section>
    <q-item-section class="col-1.3 flex flex-center" style="">
    {{$t('input_labels.manage')}}
    </q-item-section> 
    <q-item-section class="col-1.3 flex flex-center" style="">
      {{$t('input_labels.delete')}}
    </q-item-section>
        </q-item>
        <hr style="margin-bottom:60px">
        <Process
          v-for="process in filteredProcesses"
          :key="process.id"
          :Title="showProcessLabel(process)"
          :Tag_1="process.user_tags"
          :Tag_2="process.topic_tags"
          :Link="process.id"
          :theProcess="process"
          Path="guided_process_editor"
          @remove="deleteProcess"
        >
        </Process>
      </q-list>
    </div>
  </div>
  </div>
</template>


<script>
import Process from './guided_process_editor/Process'


export default {
  name: 'ProcessEditor',
  props: {
    msg: String
  },
  components: {
    Process
  },
  data () {
    return {
      search: ' ',
      activeLanguage: this.$i18n.locale,

    }
  },

  computed: {
    processes () {
      return this.$store.state.flows.flows
    },
      steps () {
      return this.$store.state.steps.steps
    },
     steplinks () {
      return this.$store.state.steplinks.steplinks
    },
   
    filteredProcesses () {
      //if none of the fields is filled in it will give the full list of processes
      if (this.search == "") {
        return this.processes
      }
      else {
        return this.processes.filter((a_process) => {
          console.log(this.activeLanguage)
          var curlangproc = a_process.translations.filter((transl) => { return transl.lang == this.activeLanguage })[0]
          //Splits the search field and puts the words in an array
          var searchArray = this.search.split(" ")
          if (searchArray.every(string => curlangproc.process.toLowerCase().includes(string))) {
            return true;
          }        })
      }
    }
  },
  methods: {
    deleteProcess (value) {
      console.log(value)
      var deletedProcess = this.processes.filter((filt) => {
        console.log("in fil")
        console.log(filt)
        return filt.id == value
      })
      console.log("I am deleted process")
      console.log(deletedProcess[0])
      var deletedSteps = this.steps.filter((step) =>{
        return step.idProcess == deletedProcess[0].id
      })
      console.log("I am deleted steps")
      console.log(deletedSteps)
      var deletedStepLinks = this.steplinks.filter((steplink) =>{
        return steplink.idProcess == deletedProcess[0].id
      })
      console.log("I am deleted steplinks")
      console.log(deletedStepLinks)
      this.$store.dispatch('flows/deleteProcess', { process:deletedProcess[0].id, steps: deletedSteps, steplinks: deletedStepLinks, comments:deletedProcess[0].comments} )
    },
    filterTranslationModel (currentLang) {
      return function (element) {
        return element.lang == currentLang;
      }
    },
    showProcessLabel (workingProcess) {
      return workingProcess.translations.filter(this.filterTranslationModel(this.activeLanguage))[0].process
    }
  },



  created () {
    this.loading = true
    console.log(this.$store);
    this.$store.dispatch('flows/fetchFlows')
      .then(processes => {
        this.loading = false
        console.log(this.processes)
      })
    this.$store.dispatch('steps/fetchSteps')
      .then(steps => {
        this.loading = false
        console.log(this.steps)
      })
     this.$store.dispatch('steplinks/fetchSteplinks')
      .then(steplinks => {
        this.loading = false
        console.log(this.steplinks)
      })
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top: 50px;
  padding-right: 80px;
  padding-bottom: 50px;
  padding-left: 80px;
}
</style>
