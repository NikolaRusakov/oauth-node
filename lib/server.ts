import {config} from 'dotenv'
import app from "./app";

const result = config();

if (result.error) {
    throw result.error
}
console.log(result.parsed)

// const env = config({path:'../.env'});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});