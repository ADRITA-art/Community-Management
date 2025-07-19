import {Snowflake} from '@theinternetfolks/snowflake'
export const generateId = () => {
   return(Snowflake.generate().toString());
}