import { BigInt } from "@graphprotocol/graph-ts"
import { KyberProxyContract, KyberNetworkSet } from "../generated/KyberProxyContract/KyberProxyContract"
import { KyberContract, AddReserveToNetwork } from "../generated/KyberContract/KyberContract";
import { ExampleEntity,
         Kyber,
         Reserve
         } from "../generated/schema"

export function handleKyberNetworkSet(event: KyberNetworkSet): void {

}

export function handleAddReserveToNetwork(event: AddReserveToNetwork): void {
  
  //Load global Kyber entity
  let kyber = Kyber.load("1")
  if (kyber == null) {
    kyber = new Kyber("1")
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

