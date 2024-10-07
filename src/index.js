import { central, db1, db2, db3, vault } from "./database.js";
// Importing database functions. DO NOT MODIFY THIS LINE.

// Test envoirnment
console.log(`Test of Promises and ASync console`)

// Part 1
// Merge users data from this db
async function getUserData(id) {
    // Validate the input id not less then 1 or bigger then 10
    if (typeof id !== 'number' || id < 1 || id > 10) {
      return Promise.reject(new Error("Invalid Input -- ID must be between 1 and 10"));
    }
  
    try {
      // Awaiting to get remote db resolve
      const dbName = await central(id);
      
      // Parsing user data from db1, db2, db3 based on the dbName returned by central
      const dbs = { db1, db2, db3 };
      const basicData = await dbs[dbName](id);
      
      // Fetch personal user data from the vault
      const personalData = await vault(id);
      
      // Data mining into a single object with the following structure
      const userData = {
        id: id,
        name: personalData.name,
        username: basicData.username,
        email: personalData.email,
        address: {
          street: personalData.address.street,
          suite: personalData.address.suite,
          city: personalData.address.city,
          zipcode: personalData.address.zipcode,
          geo: {
            lat: personalData.address.geo.lat,
            lng: personalData.address.geo.lng
          }
        },
        phone: personalData.phone,
        website: basicData.website,
        company: {
          name: basicData.company.name,
          catchPhrase: basicData.company.catchPhrase,
          bs: basicData.company.bs
        }
      };
      // Return collected object with data
      return userData;
  
    } catch (error) {
      // Catching errors
      return Promise.reject(new Error(`Failed to retrieve user data: ${error.message}`));
    }
  }


  // Testing

  getUserData(1)
  .then(data => console.log('User Data:', data))
  .catch(err => console.error('Error:', err.message));

  getUserData(5)
  .then(data => console.log('User Data:', data))
  .catch(err => console.error('Error:', err.message));

// getUserData(11) // Invalid ID
//   .then(data => console.log('User Data:', data))
//   .catch(err => console.error('Error:', err.message));

//   getUserData(-2) // Invalid ID
//   .then(data => console.log('User Data:', data))
//   .catch(err => console.error('Error:', err.message));