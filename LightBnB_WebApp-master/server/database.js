const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => { console.log(response) })




/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT id, name, email, password FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows[0]) {
        console.log(result.rows[0]);
        return result.rows[0];
      } else {
        console.log(null)
        return null
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows[0]) {
        console.log(result.rows[0]);
        return result.rows[0];
      } else {
        console.log(null)
        return null
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
// getUserWithId(15);

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
    .then((result) => {
      if (result.rows[0]) {
        console.log(result.rows[0]);
        return result.rows[0];
      } else {
        console.log(null)
        return null
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*
            FROM reservations
            JOIN properties ON reservations.property_id = properties.id
            JOIN property_reviews ON properties.id = property_reviews.property_id
            WHERE reservations.guest_id = $1
            GROUP BY properties.*, reservations.*
            ORDER BY reservations.start_date
            LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      if (result.rows[0]) {
        console.log(result.rows);
        return result.rows;
      } else {
        console.log(null)
        return null
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * //@param {{}} options An object containing query options.
 * //@param {*} limit The number of results to return.
 * //@return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(
      `SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      //console.log(result.rows);
      return result.rows;
    })
  .catch((err) => {
    console.log(err.message);
  });
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
