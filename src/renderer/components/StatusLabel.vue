<template>
    <div>
        <p>Status: <span>{{ status }}</span></p>
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
p {
  font-size: 2em;
  text-align: center;
}
</style>