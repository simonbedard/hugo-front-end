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

  onBeforeMount(async () => {
    if(images.firstLoad){
      const Url = `${nuxtApp.$config.API_BASE_URL}search/terms/${route.params.query}/1`;
      const response = await fetch(Url)
      if (response.status !== 200)
        throw new Error(`error when fetching IMAGES : Start loading from API`)
    
      const data = (await response.json());
      shuffle(data.DATA);
      images.swap(data.DATA, route.params.query.toString(), images.page);
    }
  });

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
  

        <div class="flex align-center justify-center" v-if="images.isLoading">
          <div role="status">
              <svg class="mt-4 inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
        </div>

        <div v-if="images.images.length > 0">
          <h2 class="mt-10 mb-4 text-lg font-bold">Searching for: <span class="text-green">({{ images.terms }})</span></h2>
          <div class="grid">
            <div class="col" v-for="col in images.chunks" :key="col">
              <div class="card bg-gray-900 relative group" v-for="image in col" :key="image">
                <a :href="image.src.download" target="_blank" rel="noopener noreferrer">
                  <img class="rounded-lg w-full group-hover:opacity-60 ease-out duration-300" :src="image.src.thumbnail" :alt="image.src.alt">
                </a>
                <div class="card__infos absolute bottom-2 right-3 shadow-lg rounded-lg text-black p-2 bg-white/[.80] text-xs opacity-0 group-hover:opacity-100 ease-out duration-300">
                  <a class="block" :src="image.provider.url" target="_blank" rel="noopener noreferrer">{{ image.provider.name }}</a>
                </div>
              </div>
            </div>
          </div>
          <div class="flex align-center justify-center">
            <Button
                class="capitalize w-full md:w-auto mt-10"
                :text="getButtonText"
                type="primary"
                size="md"
                @click="$emit('loadMoreImages')"
              />
          </div>
        </div>
        <div v-else>
            <div class="grid">
              <div class="col" v-for="index in 4" :key="index">
                <div class="card card--lazy rounded-lg bg-gray-800 " v-for="index in 10" :key="index"></div>
              </div>
          </div>
        </div>
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