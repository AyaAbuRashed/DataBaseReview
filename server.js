'use strict';


require('dotenv').config()
const PORT = process.env.PORT;
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
app.use(cors());
// const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);
const key = process.env.GEOCODE_API_KEY;


const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

// =============================================================
app.get('/location', handleAddress);

//================================================================
function Address(name, location, latitude, longitude) {
    this.search_query = name,
    this.formatted_query = location,
    this.latitude = latitude,
    this.longitude = longitude
}
// function handleAddress(request, response) {
//   const city = request.query.city;
//   const selectSql = `SELECT * FROM locationTable WHERE search_query = '${city}'`;
//   client.query(selectSql).then(result=>{
//       let datafromdb = result.rows[0];
//       if(datafromdb){
//           response.status(200).send(datafromdb);
//           console.log('from DataBase',datafromdb);
//         }
//         else{
//           //API url
//         const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
//         superagent.get(url).then(res => {
//           const city = request.query.city;
//           const loc = res.body[0];
//           const locData = new Address(request.query.city, loc.display_name, loc.lat, loc.lon);
//           response.status(200).send(locData);
//           const addSql = 'INSERT INTO addressTable (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
//           const values = [city, loc.display_name, loc.lat, loc.lon];
//           client.query(addSql,values).then(response =>{
//               console.log('add to DataBase',response);
//           })

//         })
//       }
//   })
  
// };


// app.listen(PORT, () => console.log(`App is running on Server on port: ${PORT}`));


function handleAddress(request,response){
  const city = request.query.city;
  const selectSql = `SELECT * FROM locationTable WHERE search_query = '${city}'`;
  client.query(selectSql).then(result =>{
     let datafromDB = result.rows[0];
     if(datafromDB){
       response.status(200).send(datafromDB);
       console.log("data from DB",datafromDB);
       
     }else{
      const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
      superagent.get(url).then(res =>{
        const loc = res.body[0];
        const locData = new Address (city,loc.display_name,loc.lat,loc.lon);
        response.status(200).send(locData);
        const addSql = 'INSERT INTO locationTable (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)';
        const values = [city,loc.display_name,loc.lat,loc.lon];
        client.query(addSql,values).then(response=>{
          console.log("data from ApI",response);
          
        }) 


      })
     }
  })



}



client.connect().then(()=>{
    console.log('connected to DataBase');
    app.listen(PORT, () => console.log(`App is running on Server on port: ${PORT}`));
});





