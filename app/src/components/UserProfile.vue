<template>
<div>
   <div class="row " style="width:750px">
     <h3 style="margin-bottom:30px;padding-left:12px;width:65%; font-size:25pt; font-weight:600">{{user.umUserName}}</h3>
     <span style="text-align:right; width:35%;display: inline-block; vertical-align:middle">
     <q-btn style="width:250px; margin-top:37px; margin-bottom:30px;margin-left:5px; border-radius:2px" unelevated color="accent" rounded :label="$t('button.add_plan')" no-caps size="15px" @click="addInterventionPlan" />
     </span >
    <q-card class="my-card" style="width:750px; margin-left:10px" flat >
      <q-card-section horizontal>
        <q-card-section style="width:100%;padding-left:2px">
         <div>
      <span style="text-align:left;font-size:20pt;">{{$t('profile.username')}}: </span><span style="font-size:20pt">{{user.umUserName}}</span>
  </div>
  <div>
      <span style="text-align:left;font-size:20pt">{{$t('profile.legal_name')}}: </span><span style="font-size:20pt">{{user.username}}</span>
  </div>
  <div>
      <span style="text-align:left;font-size:20pt">{{$t('profile.age')}}: </span><span style="font-size:20pt">{{user.age}}</span>
  </div>
  <div>
      <span style="text-align:left;font-size:20pt">{{$t('profile.nationality')}}: </span><span style="font-size:20pt">{{user.nationality}}</span>
  </div>
  <div>
      <span style="text-align:left;font-size:20pt">{{$t('profile.gender')}}: </span><span style="font-size:20pt">{{user.gender}}</span>
  </div>
  <div>
      <span style="text-align:left;font-size:20pt">{{$t('profile.status')}}: </span><span style="font-size:20pt">{{user.user_type}}</span>
  </div>
        </q-card-section >
<div style="text-align: right; width:50%">
        <img
          width="250px"
          height="250px"
          class="col-6"
          src="~assets/UserProfile.png"
          style="border-radius:10px"
        />
    </div>
      </q-card-section>
    </q-card>
   </div>
   </div>
</template>

<script>
export default {
  name: "UserProfile",
  props:["user"],
  components: {},
  computed: {},
  mounted() {},
  methods: {
    addInterventionPlan(){
       console.log(this.user)
      this.$router.push({ name: 'addinterventionplan', params: { theuser: this.user, theuserid: this.user.umId } })
    }
  }
};
</script>

<style scoped>

</style>
