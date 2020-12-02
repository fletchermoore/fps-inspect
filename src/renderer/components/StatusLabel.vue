<template>
    <div class="text-sm-body-2">
        Status: <span>{{ status }}</span>
    </div>    
</template>

<script lang=ts>


module.exports = {
  data: function() {
    return {
      status: "Idle"
    };
  },

  mounted: function() {
    window.app.on('status-updated', (status: string) => {
        this.status = status;
    });
  },
  methods: {

  }
};
</script>

<style scoped>

</style>