import { BigInt } from "@graphprotocol/graph-ts"
import {
  Tellor,
  Approval,
  NewChallenge,
  NewDispute,
  NewValue,
  NonceSubmitted,
  TipAdded,
  Transfer,
  Voted
} from "../generated/Tellor/Tellor"
import { crypto, ByteArray } from '@graphprotocol/graph-ts'
import { Transaction, Avg } from "../generated/schema"

export function handleApproval(event: Approval): void {
}

export function handleNewChallenge(event: NewChallenge): void {}

export function handleNewDispute(event: NewDispute): void {}

export function handleNewValue(event: NewValue): void {}

export function handleNonceSubmitted(event: NonceSubmitted): void {}

export function handleTipAdded(event: TipAdded): void {}

export function handleTransfer(event: Transfer): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type



  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand


  let blockNumber = event.block.number

  let gasPrices: BigInt[] = []
  let blockNumberCounter = blockNumber.minus(new BigInt(60480))

  //iterate through blocks to collect a list of block averages
  while (blockNumberCounter < blockNumber) {

    // let count = new BigInt(1)
    
    // let product = blockNumber.times(count)
  
    // let hash = crypto.keccak256(ByteArray.fromBigInt(product))

    //load transaction event if already registered
    let entity = Transaction.load(blockNumberCounter.toString())

    //collect average of the block
    blockNumberCounter.plus(new BigInt(1))

    if (!entity) {
      entity = new Transaction(blockNumberCounter.toString())
      entity.gasPrice = event.transaction.gasPrice
      entity.timestamp = event.block.timestamp
      entity.save()
    }

    //push to list of averages
    gasPrices.push(entity.gasPrice)

    blockNumberCounter.plus(new BigInt(1))

}

let sum = gasPrices.reduce((a: BigInt, b: BigInt) => a.plus(b), new BigInt(0))

let avg = sum.div(new BigInt(gasPrices.length))

let entity = Avg.load(blockNumber.toString())
if (!entity) {
  entity = new Avg(blockNumber.toString())
  entity.gasPrice = avg
  entity.timestamp = event.block.timestamp
  entity.save()
}
}

export function handleVoted(event: Voted): void {}
