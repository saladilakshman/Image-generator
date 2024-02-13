import { configureStore } from '@reduxjs/toolkit';
import { AiApi } from '../ApiServices/apiservices';
export const store=configureStore({
    reducer:{
     [AiApi.reducerPath]:AiApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AiApi.middleware),
})