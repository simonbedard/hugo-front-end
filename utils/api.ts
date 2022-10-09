export function APIManager() {
  const runtime = useRuntimeConfig();
  const testUrl = `${runtime.public.API_BASE_URL}test`
  // composable

  // state
  const getApiConnexion = () => {

    let connexionStatus:boolean = true;

    const { data, pending, error, refresh } = useFetch(testUrl, {
      onRequest({ request, options }):any {
        // Set the request headers
        options.headers = options.headers || {}
        //options.headers.authorization = '...'
      },
      onRequestError({ request, options, error }):any {
        // Handle the request errors
        
        connexionStatus = false;
        return false;
      },
      onResponse({ request, response, options }):any {
        // Process the response data
        response._data;
        return false;
        //connexionStatus = true;
      },
      onResponseError({ request, response, options }):any {
        // Handle the response errors
        connexionStatus = false;
      }     
    });

    if(error.value){
      return false;
    }else{
      return true;
    }
    
  }
  // state
  const apiConnexion = useState<boolean>('api.connexion', () =>
    getApiConnexion()
  )

  const init = async() => {
    apiConnexion.value = getApiConnexion();
  }

  // lifecycle
  onBeforeMount(() => init())

  return {
    apiConnexion,
    init,
  }
}
