import { BigInt } from "@graphprotocol/graph-ts"
import { KyberProxyContract, KyberNetworkSet } from "../generated/KyberProxyContract/KyberProxyContract"
import { KyberContract } from "../generated/templates";

import { AddReserveToNetwork, KyberTrade } from "../generated/templates/KyberContract/KyberContract";

import { Kyber,
         Reserve
         } from "../generated/schema"

export function handleKyberNetworkSet(event: KyberNetworkSet): void {
  //Whenever a new Kyber contract is set
  //Create a dynamic data source contract from template
  KyberContract.create(event.params.newNetworkContract)

}

export function handleAddReserveToNetwork(event: AddReserveToNetwork): void {
  
  //Load global Kyber entity
  let kyber = Kyber.load("1")
  if (kyber == null) {
    kyber = new Kyber("1")
    kyber.totalTrades = BigInt.fromI32(0)
    kyber.totalEthToToken = BigInt.fromI32(0)
    kyber.totalTokenToEth = BigInt.fromI32(0)
    kyber.totalTokenToToken = BigInt.fromI32(0)
    kyber.reservesCount = 0
  }
  let add = event.params.add
  //If a new reserve is being added
  if (add) {
    let reserve = new Reserve(event.params.reserve.toHexString())
    reserve.save()
    kyber.reservesCount = kyber.reservesCount + 1
  } else {
    kyber.reservesCount = kyber.reservesCount - 1
  }
  kyber.save()
}  

export function handleKyberTrade(event: KyberTrade): void {
  let ETH_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  let srcToken = event.params.src.toHexString()
  let destToken = event.params.dest.toHexString()

  //Load global Kyber entity
  let kyber = Kyber.load("1")
  if (kyber == null) {
    kyber = new Kyber("1")
    kyber.totalTrades = BigInt.fromI32(0)
    kyber.totalEthToToken = BigInt.fromI32(0)
    kyber.totalTokenToEth = BigInt.fromI32(0)
    kyber.totalTokenToToken = BigInt.fromI32(0)
    kyber.reservesCount = 0
  }

  if (srcToken == ETH_TOKEN_ADDRESS) {
    kyber.totalEthToToken = kyber.totalEthToToken.plus(BigInt.fromI32(1))
  } else if (destToken == ETH_TOKEN_ADDRESS) {
    kyber.totalTokenToEth = kyber.totalTokenToEth.plus(BigInt.fromI32(1))
  } else {
    kyber.totalTokenToToken = kyber.totalTokenToToken.plus(BigInt.fromI32(1))
  }
  kyber.totalTrades = kyber.totalTrades.plus(BigInt.fromI32(1))
  kyber.save()
}

