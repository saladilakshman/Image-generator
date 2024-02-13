import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AI_KEY } from '../key';
export const AiApi = createApi({
   reducerPath: 'ai-generation',
   baseQuery: fetchBaseQuery({
      baseUrl: 'https://open-ai21.p.rapidapi.com/texttoimage2',
      prepareHeaders(headers) {
        headers.set('X-RapidAPI-Key',AI_KEY);
        headers.set('X-RapidAPI-Host', 'open-ai21.p.rapidapi.com');
        return headers;
      },
    }),
   endpoints: (builder) => ({
      getImage: builder.mutation({
         query: (txt) => ({
            method:'POST',
            body:{text:txt}
         })
      }),
   })
})

export const { useGetImageMutation} = AiApi;