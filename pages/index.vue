
<script lang="ts" setup>
import p from './../package.json';

// meta
definePageMeta({
  layout: 'page',
})


</script>
<template> 
  <PageWrapper>
    <PageSection>
      <Alert
        type="success"
        :title="p.name +'-'+ p.version+' - ' + p.devDependencies.nuxt + '-'"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        class="mb-6"
      />
    </PageSection>
    <PageSection>
      <GridImages />
    </PageSection>
  </PageWrapper>
</template>

<style lang="scss">
@import '../assets/sass/variables';

.grid{
    grid-gap: 20px;
    align-items: start;
    display: grid;
    grid-template-columns: repeat(4 ,minmax(0,1fr));
    .col{
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(1 ,minmax(0,1fr));
      &:nth-child(even){
        .card--lazy{
          height: 20vw;
        }
      }
      .card{
        &--lazy{
          width: 100%;
          height: 15vw;
        }
      }
    }
}



html.dark {
  .animated-text-bg {
    color: theme('colors.gray.100');
    &:before {
      color: theme('colors.gray.100');
    }
  }
}

.triangle-shape {
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 40px solid theme('colors.green.600');
  transform: translate(-15rem, -6rem) rotate(45deg);
}
</style>