'use strict';
require('babel-register');
const _ = require('lodash');
const faker = require('faker');
const size = 20000;

const write = process.stdout.write.bind(process.stdout);

function createStubItem(id) {
    return {
        id: id,
        name: faker.name.findName(),
        address: `${faker.address.streetName()}, ${faker.address.city()}`,
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        website: faker.internet.domainName(),
        company: faker.company.companyName(),
        height: _.random(40,90)
    };
}

write('var stubs = [');
for(let i = 0; i < size; i++) {
    const card = JSON.stringify(createStubItem(i));
    write(card);
    write(i < size - 1 ? ',' : '');
    write('\n');
}
write(']');


