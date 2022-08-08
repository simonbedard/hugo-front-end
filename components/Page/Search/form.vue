<script lang="ts" setup>
import { useImages } from '~/stores/images';
import { shuffle } from '~/utils/arr';
import { ISearchHistory } from '~/utils/search';
const images = useImages();
const router = useRouter();
const search = ref<string>(images.terms);
const searchHistory = useState<Array<ISearchHistory>>('search.history');

let errorMessage = ref<any>(null);

defineProps({
  text: {
    type: String,
    default: '',
  },
});


// methods
const searchQuery = async () => {
  try {
    images.loading(true);
    const FormatedValue = search.value.toLowerCase();
    const API_URL = `http://localhost:3012/api/v1/search/terms`
    const Url = `${API_URL}/${FormatedValue}/${images.page}`;

    const response = await fetch(Url);

    if (response.status !== 200){
      throw new Error(`error when fetching IMAGES : ${search.value} from API`)
    }
    
    const data = (await response.json());

    shuffle(data.data);
        
    searchHistory.value.push({title: FormatedValue});

    // Redirect to homepage search
    router.push({ path: "/" });
    
    // Swap array of images 
    images.swap(data.data, search.value, images.page);
    images.loading(false);

  } catch (err: any) {
    images.loading(false);
    errorMessage.value = err.message;
  }
}

const loadMore = async () => {
  images.loading(true);
      
    const API_URL = `http://localhost:3012/api/v1/search/terms`
    const Url = `${API_URL}/${search.value}/${images.page}`;
    const response = await fetch(Url)
    if (response.status !== 200)
      throw new Error(`error when fetching IMAGES : ${search.value} from API`)
    
    const data = (await response.json());
    shuffle(data.data);
   // Swap array of images 
    images.append(data.data, (images.page+1));
    images.loading(false);
}

defineExpose({
  loadMore: loadMore
});

onMounted(() => {
  // console.log(searchHistory);
})

</script>

<template>
  <div>
      <div class="flex flex-col items-center md:flex-row md:space-x-2 mx-20">
      
          <FormTextInput
            v-model="search"
            :modelValue="search"
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
