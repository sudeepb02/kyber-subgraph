import { BigInt } from "@graphprotocol/graph-ts"
import { KyberProxyContract,
         KyberNetworkSet } from "../generated/KyberProxyContract/KyberProxyContract"
import { KyberContract,
         ReserveContract
        } from "../generated/templates";

import { AddReserveToNetwork,
         KyberTrade 
        } from "../generated/templates/KyberContract/KyberContract";

import { DepositToken,
         TradeExecute,
         TradeEnabled,
         WithdrawAddressApproved,
         WithdrawFunds,        
        } from "../generated/templates/ReserveContract/ReserveContract";

import { Kyber,
         Reserve
         } from "../generated/schema"

const ETH_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

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
  //Check if Reserve Contract already exists
  let reserve = Reserve.load(event.params.reserve.toHexString())

  if (reserve == null) {
    //Reserve contract is not being indexed,
    //Create Reserve Contract using ReserveContract Template
    ReserveContract.create(event.params.reserve)
    reserve = new Reserve(event.params.reserve.toHexString())

    //Initialize entity
    if (event.params.isPermissionless == true) {
      reserve.type = 1
    } else {
      reserve.type = 2
    }
    reserve.tradeEnabled = true
    
    reserve.ethDepositCount = BigInt.fromI32(0)
    reserve.tokenDepositCount = BigInt.fromI32(0)
    reserve.ethWithdrawCount = BigInt.fromI32(0)
    reserve.tokenWithdrawCount = BigInt.fromI32(0)

    reserve.totalEthDeposited = BigInt.fromI32(0)
    reserve.totalEthWithdrawn = BigInt.fromI32(0)

    reserve.totalTrades = BigInt.fromI32(0)
    reserve.totalEthToToken = BigInt.fromI32(0)
    reserve.totalTokenToEth = BigInt.fromI32(0)
    reserve.totalTokenToToken = BigInt.fromI32(0)  
  }
  reserve.save()

  let add = event.params.add
  if (add) {
    kyber.reservesCount = kyber.reservesCount + 1
  } else {
    kyber.reservesCount = kyber.reservesCount - 1
  }
  kyber.save()
}  

export function handleKyberTrade(event: KyberTrade): void {

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

export function handleDepositToken(event: DepositToken): void {

}

export function handleTradeExecute(event: TradeExecute): void {

}

export function handleTradeEnabled(event: TradeEnabled): void {

}

export function handleWithdrawAddressApproved(event: WithdrawAddressApproved): void {

}

export function handleWithdrawFunds(event: WithdrawFunds): void {

}

