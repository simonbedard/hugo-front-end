<script lang="ts" setup>
  import { useImages } from '~/stores/images'
  import { shuffle } from '~/utils/arr'
  import { ISearchHistory } from '~/utils/search';

  // Composable
  const { t } = useLang();
  const images = useImages();
  const nuxtApp = useNuxtApp()
  const route = useRoute();
  const searchHistory = useState<Array<ISearchHistory>>('search.history');
  const openHistory = ref(false);
  definePageMeta({
    layout: 'page',
  })

  onMounted(() => {     
    setTimeout(() =>  {
      openHistory.value = true
    }, 2000)
  })

  const getButtonText = computed(() => images.isLoading ? '...' : 'Load more')


</script>


<template>
  <PageWrapper>
      <PageSection>
        
        <Transition>
            <div v-show="openHistory" class="p-8 previous-search bg-white dark:bg-slate-900">
              <h3 class="text-lg font-bold mb-4">Search history</h3>
              <ul class="te">
                <li v-for="terms in searchHistory" :key="terms">
                  <p>{{ terms.title }}</p>
                </li>
              </ul>
          </div>
        </Transition>
  
        <GridImages />

    </PageSection>
  </PageWrapper>
</template>

<style  lang="scss">
  .previous-search{
    position: fixed;
    left: 0;
    top: 100px;
    width: 100px;
    z-index: 10;
    height: calc(100vh - 100px);
    ul{
      display: flex;
      flex-direction: column-reverse;
    }
  }

  /* we will explain what these classes do next! */
  .v-enter-active,
  .v-leave-active {
    transition: all 0.5s ease-out;
    transform: translate3d(0,0,0);
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: translate3d(-100%,0,0);
  }
</style>