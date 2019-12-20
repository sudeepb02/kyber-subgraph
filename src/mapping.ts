import { BigInt, store } from "@graphprotocol/graph-ts"
import { KyberProxyContract,
         KyberNetworkSet } from "../generated/KyberProxyContract/KyberProxyContract"
import { KyberContract,
         ReserveContract
        } from "../generated/templates";

import { AddReserveToNetwork,
         KyberTrade,
         RemoveReserveFromNetwork 
        } from "../generated/templates/KyberContract/KyberContract";

import { DepositToken,
         TradeExecute,
         TradeEnabled,
         WithdrawAddressApproved,
         WithdrawFunds,        
        } from "../generated/templates/ReserveContract/ReserveContract";

import { Kyber,
         Reserve,
         KyberDayData
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

  //Save Daily stats
  let dayID = event.block.timestamp.div(BigInt.fromI32(86400))
  let dayData = KyberDayData.load(dayID.toString())
  if (dayData == null) {
    dayData = new KyberDayData(dayID.toString())

    //Initialize counts
    dayData.totalTrades = BigInt.fromI32(0)
    dayData.totalEthToToken = BigInt.fromI32(0)
    dayData.totalTokenToEth = BigInt.fromI32(0)
    dayData.totalTokenToToken = BigInt.fromI32(0)
    dayData.totalVolumeInEth = BigInt.fromI32(0)
  }
  dayData.save()
}

export function handleDepositToken(event: DepositToken): void {

  let reserve = Reserve.load(event.address.toHexString())
  //Additional check as Reserve entity will be created 
  //when contract is added from template
  if (reserve != null) {
    if (event.params.token.toHexString() == ETH_TOKEN_ADDRESS) {
      reserve.ethDepositCount = reserve.ethDepositCount.plus(BigInt.fromI32(1))
      reserve.totalEthDeposited = reserve.totalEthDeposited.plus(event.params.amount)
    } else {
      reserve.tokenDepositCount = reserve.tokenDepositCount.plus(BigInt.fromI32(1))
    }
    reserve.save()
  }
}

export function handleTradeExecute(event: TradeExecute): void {
  let srcToken = event.params.src.toHexString()
  let destToken = event.params.destToken.toHexString()
  
  let reserve = Reserve.load(event.address.toHexString())
  if (reserve != null) {
    if (srcToken == ETH_TOKEN_ADDRESS) {
      reserve.totalEthToToken = reserve.totalEthToToken.plus(BigInt.fromI32(1))
    } else if (destToken == ETH_TOKEN_ADDRESS) {
      reserve.totalTokenToEth = reserve.totalTokenToEth.plus(BigInt.fromI32(1))
    } else {
      reserve.totalTokenToToken = reserve.totalTokenToToken.plus(BigInt.fromI32(1))
    }
    reserve.totalTrades = reserve.totalTrades.plus(BigInt.fromI32(1))
    reserve.save()
  }
}

export function handleTradeEnabled(event: TradeEnabled): void {
  let reserve = Reserve.load(event.address.toHexString())
  if (reserve != null) {
    //Update status of reserve trade if it's being changed
    if (event.params.enable != reserve.tradeEnabled) {
      reserve.tradeEnabled = event.params.enable
      reserve.save()
    }
  }

}

export function handleWithdrawAddressApproved(event: WithdrawAddressApproved): void {

}

export function handleWithdrawFunds(event: WithdrawFunds): void {

  let reserve = Reserve.load(event.address.toHexString())

  if (reserve != null) {
    if (event.params.token.toHexString() == ETH_TOKEN_ADDRESS) {
      reserve.ethWithdrawCount = reserve.ethWithdrawCount.plus(BigInt.fromI32(1))
      reserve.totalEthWithdrawn = reserve.totalEthWithdrawn.plus(event.params.amount)
    } else {
      reserve.tokenWithdrawCount = reserve.tokenWithdrawCount.plus(BigInt.fromI32(1))
    }
    reserve.save()
  }
}

export function handleRemoveReserveFromNetwork(event: RemoveReserveFromNetwork): void {
  let reserve = Reserve.load(event.params.reserve.toHexString())
  //Remove reserve entity
  if (reserve != null) {
    reserve.tradeEnabled = false
    reserve.save()
    store.remove("Reserve", event.params.reserve.toHexString())

    //Update reserves count
    let kyber = Kyber.load("1")
    if (kyber != null) {
      kyber.reservesCount = kyber.reservesCount - 1
      kyber.save()
    }
  }

  
}
