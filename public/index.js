'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(truckers);
console.log(deliveries);
console.log(actors);


// STEP FIVE

console.log("STEP FIVE");

//Go through all deliveries
deliveries.forEach(function(delivery) {
  var truckerId = delivery.truckerId,
      trucker = getTruckerById(truckerId),
      pricePerKm = trucker.pricePerKm,
      pricePerVolume = trucker.pricePerVolume,
      updatedPrice = calculateReductionOnVolume(delivery.volume, pricePerVolume),
      compVolume = delivery.volume * updatedPrice,
      compDistance = delivery.distance * pricePerKm,
      total = compDistance + compVolume;

  //Start calculating commission
  var commission = 0.3 * total,
      insurance = 0.5 * commission,
      treasury = Math.floor(delivery.distance / 500) + 1,
      convargo = commission - insurance - treasury,
      deductible;

  delivery.commission.insurance = insurance;
  delivery.commission.treasury = treasury;

  if(delivery.options.deductibleReduction){
    deductible = delivery.volume;
    total += deductible;
    convargo += deductible;
  }

  delivery.price = total;
  delivery.commission.convargo = convargo;

  console.log(delivery);

  var actor = getActorById(delivery.id)

  actor.payment.forEach(function(payment){
    switch(payment.who){
      case "shipper":
        payment.amount = total;
        break;
      case "trucker":
        payment.amount = total - commission;
        break;
      case "insurance":
        payment.amount = insurance;
        break;
      case "treasury":
        payment.amount = treasury;
        break;
      case "convargo":
        payment.amount = convargo;
        break;
    }
  })



  console.log(actors);
});



function calculateReductionOnVolume(volume, pricePerVolume) {
  var updatedPrice;

  if(volume > 5 && volume < 10){
    updatedPrice = pricePerVolume - (0.1 * pricePerVolume);
  } else if(volume > 10 && volume < 25) {
    updatedPrice = pricePerVolume - (0.3 * pricePerVolume);
  } else if(volume > 25) {
    updatedPrice = pricePerVolume - (0.5 * pricePerVolume);
  } else {
    updatedPrice = pricePerVolume;
  }
  return updatedPrice;
}


function getTruckerById(id) {
  var truckerReturned;
  truckers.forEach(function(trucker) {
    if(trucker.id == id) {     //When found, get the associated prices
      truckerReturned = trucker;
    }
  });
  return truckerReturned;
}


function getActorById(id) {
  var actorReturned;

  actors.forEach(function(actor) {
    if(actor.deliveryId == id){
      actorReturned = actor;
    }
  });
  return actorReturned;
}
