import { ChainId, Token } from '@uniswap/sdk-core'
import { ethers } from 'ethers'
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json' assert { type: 'json' };
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' };


// Addresses
const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

// Currencies and Tokens
const WETH_TOKEN = new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
)

const USDC_TOKEN = new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
)

const WBTC_TOKEN = new Token(
    ChainId.MAINNET,
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    8,
    'WBTC',
    'Wrapped Bitcoin'
)

const USDT_TOKEN = new Token(
    ChainId.MAINNET,
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    6,
    'USDT',
    'USDT'
)

const CurrentConfig = {
    rpc: {
      local: 'http://127.0.0.1:8545',
      mainnet: 'https://mainnet.chainnodes.org/8e968293-fed9-42bf-8964-037ca5fe7961',
    },
    tokens: {
      in: WBTC_TOKEN,
      amountIn: 1,
      out: USDT_TOKEN,
      poolFee: FeeAmount.MEDIUM,
    },
}

const READABLE_FORM_LEN = 10

function fromReadableAmount(amount, decimals) {
    return ethers.utils.parseUnits(amount.toString(), decimals)
}

function toReadableAmount(rawAmount, decimals) {
    return ethers.utils
        .formatUnits(rawAmount, decimals)
        .slice(0, READABLE_FORM_LEN)
}

// Provider Functions
function getProvider() {
  return new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.mainnet)
}

export async function quote() {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    getProvider()
  )

//   const poolConstants = await getPoolConstants()

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    CurrentConfig.tokens.in.address,
    CurrentConfig.tokens.out.address,
    CurrentConfig.tokens.poolFee,
    fromReadableAmount(
      CurrentConfig.tokens.amountIn,
      CurrentConfig.tokens.in.decimals
    ).toString(),
    0
  )

  return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}

async function getPoolConstants() {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  })

  console.log("currentPoolAddress: ", currentPoolAddress)

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider()
  )

  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  console.log("token0: ", token0)
  console.log("token1: ", token1)
  console.log("fee: ", fee)

  return {
    token0,
    token1,
    fee,
  }
}