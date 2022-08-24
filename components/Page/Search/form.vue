<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useImages } from '~/stores/images';
import { shuffle } from '~/utils/arr';
import { ISearchHistory } from '~/utils/search';
const images = useImages();
const router = useRouter();
const search = ref<string>(images.terms);
const searchHistory = useState<Array<ISearchHistory>>('search.history');
const nuxtApp = useNuxtApp();

let errorMessage = ref<any>(null);
const checkedNames = ref<Array<String>>([]);
const providers = reactive(['Unsplash', 'Pexel', 'Pixabay', 'Deposite']);

const checkedorientations = ref<Array<String>>([]);
const orientations = reactive(['landscape', 'portrait', 'squarish']);

defineProps({
  text: {
    type: String,
    default: '',
  },
});

images.filters.providers = checkedNames;
// methods
const searchQuery = async () => {

  try {
    const FormatedValue = search.value.toLowerCase();
    // Redirect to homepage search
    history.pushState({},`/search/${FormatedValue}`);

    images.loading(true);
  
    images.reset();

    
    await navigateTo({
        path: `/search/${FormatedValue}`,
        replace: false,
    });

    const API_URL = `http://localhost:3012/api/v1/search/terms`
    let Url:URL=  new URL(`${API_URL}/${FormatedValue}/${images.page}`);
    
    if(images.filters.providers.length > 0){
      // There is a provider filters
      Url.searchParams.set('provider', images.filters.providers.join(","));
    }

    const response = await fetch(Url.toString());
    if (response.status !== 200){
      throw new Error(`error when fetching IMAGES : ${search.value} from API`)
    }
    
    const data = (await response.json());
    shuffle(data.DATA);
    searchHistory.value.push({title: FormatedValue});
    
    // Swap array of images 
    images.swap(data.DATA, search.value, images.page);
    images.loading(false);

  } catch (err: any) {
    images.loading(false);
    errorMessage.value = err.message;
  }
}

onMounted(() => {

})

</script>

<template>
  <div>
      <div class="flex flex-col items-center md:flex-row md:space-x-2 mx-20">
          <Popover class="relative">
              <PopoverButton>
                <Button
                  class="capitalize w-full md:w-auto"
                  text="Filters"
                  type="secondary"
                  size="md"
                />
              </PopoverButton>

              <PopoverPanel class="absolute z-50 top-full left-0 w-100	mt-2 p-4 outline-none bg-white rounded-lg ring-1 ring-gray-900/10 shadow-lg overflow-hidden text-sm text-gray-700 font-semibold dark:bg-gray-800 dark:ring-0 dark:highlight-white/5 dark:text-gray-300">
                  <div class="filter-zone">
                    <p class="font-bold pb-2 mb-2 border-b border-solid border-gray-700">Filter by provider</p>
                    <div class="checkboxs-list flex items-center">
                      <div class="input flex mx-1 items-center" v-for="provider in providers" :key="provider">
                        <input class="appearance-none" type="checkbox" :id="provider" :value="provider.toLowerCase()" v-model="checkedNames">
                        <label class="cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30" :for="provider">{{ provider }}</label>
                      </div>
                    </div>
                   <p class="font-bold pb-2 mb-2 border-b border-solid border-gray-700">Filter by orientation</p>
                    <div class="checkboxs-list flex items-center">
                      <div class="input flex mx-1 items-center" v-for="orientation in orientations" :key="orientation">
                        <input class="appearance-none" type="checkbox" :id="orientation" :value="orientation.toLowerCase()" v-model="checkedorientations">
                        <label class="cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30" :for="orientation"><IconMaterialSymbols:crop-landscape-outline/>{{ orientation }}</label>
                      </div>
                    </div>
                  </div>
              </PopoverPanel>
          </Popover>
          <FormTextInput
            v-model="search"
            :modelValue="search"
            @keydown.enter="searchQuery"
            size="md"
            class="w-full">
            <template #prefix-disabled>
              <span class="flex-1 px-4 py-2">
                <IconUil:search />
              </span>
            </template>
          </FormTextInput>
          <Button
            class="capitalize w-full md:w-auto"
            text="Search"
            type="primary"
            size="md"
            @click.prevent="searchQuery"
          />
      </div>
      <div v-if="errorMessage">
          <p class="error ">{{ errorMessage }}</p>
      </div>
  </div>
</template>


<style lang="scss">
  input[type="checkbox"]:checked + label {
      color: theme('colors.primary.500') !important;
      background-color: theme('colors.gray.900') !important;
  }
</style>