export const BOOTSTRAP_TEMPLATE =`{
	val withdrawFee         = 10000000L
	val saleSuccessorScript = fromBase58("31R3ahVVPfKRUos8kLShhPyK3shaKEgBt5ZaRCE4vWZasC5gWAjAaTYW3UsfLM4ZjcRjfxd1EdvEoFkpNq3gJfn1")
	val terminationScript   = fromBase58("2z3xivBgYxhh2GLzoFEcy9MiAebo3sTw19Pe2DcPoUVdHUsGHRAHFdGobkdiEYdTW3mkZhofHy4ZP7rEMYP9WU9F") 
	val swampAudioNode      = PK("9iAp6nJugJciwfZK5rDt4civh4jnnT13j4fXoBLqscC7GRbpt5s").propBytes

	val heldERG0           = SELF.value
	val heldTokens0        = SELF.tokens
	val initialShares      = SELF.R4[Coll[(Long,Coll[Byte])]].get
	val initialTokenList   = SELF.R5[Coll[Coll[Byte]]].get
	val initialTokenAmount = SELF.R6[Long].get

	val successor = OUTPUTS(0)
	
	val heldERG1         = successor.value
	val heldTokens1      = successor.tokens
	val finalShares      = successor.R4[Coll[(Long,Coll[Byte])]].get
	val finalTokenList   = successor.R5[Coll[Coll[Byte]]].get
	val finalTokenAmount = successor.R6[Long].get
	
	val deltaERG = heldERG1 - heldERG0
	
    val validSelfSuccessorScript = successor.propositionBytes == SELF.propositionBytes
	
	val validDeltaERG = deltaERG >= 0
	
	val slicedInitialTokens = heldTokens0.slice(0, heldTokens0.size) // Needed because comparison doesnt work without slicing
	val slicedFinalTokens   = heldTokens1.slice(0, heldTokens0.size) 
	
	val validDeltaTokens = slicedInitialTokens == slicedFinalTokens
	
	val validRegisters = initialShares == finalShares && initialTokenList == finalTokenList && initialTokenAmount == finalTokenAmount
	
	val validDeposit = (
		validSelfSuccessorScript &&
		validDeltaERG &&
		validDeltaTokens &&
		validRegisters
	)

	val validSaleSuccessorScript = blake2b256(successor.propositionBytes) == saleSuccessorScript
	
	val validSuccessorTokens = initialTokenList.forall { 
		(id: Coll[Byte]) => successor.tokens.exists {
			(token: (Coll[Byte], Long)) => token(0) == id && token(1) >= finalTokenAmount
		}
	}
	
	val terminationConditions = if(OUTPUTS.size > 2 && OUTPUTS(1).tokens.size > 0 && OUTPUTS(1).R7[Coll[(Long,Coll[Byte])]].isDefined) {
		val termination = OUTPUTS(1)
		
		val terminationToken   = termination.tokens(0)
		val terminationParties = termination.R7[Coll[(Long,Coll[Byte])]].get // R4-R6 Occupied In Asset Creation
		
		val withdrawalRegister = successor.R7[(Coll[Byte], Long)].get
		
		val validTerminationScript  = blake2b256(termination.propositionBytes) == terminationScript
		val validToken              = terminationToken._1 == SELF.id && terminationToken._2 == terminationParties.size
		val validParties            = terminationParties == initialShares
		val validWithdrawalRegister = withdrawalRegister == terminationToken
		
		validTerminationScript && validToken && validParties && validWithdrawalRegister
	} else { false }

	val validSaleCombine = (
		validSaleSuccessorScript &&
		validSuccessorTokens &&
		validRegisters &&
		terminationConditions
	)
	
	val swampAudioBox = OUTPUTS(1)
	
	val validSwampAudioScript = swampAudioBox.propositionBytes == swampAudioNode
	
	val validSwampValue = swampAudioBox.value >= withdrawFee
	
	val withdrawBoxConditions = if (OUTPUTS.size > 3) {
		val withdrawBox = OUTPUTS(2)
		
		val providedWithdrawIndex = withdrawBox.R4[Int].get
		
		val validWithdrawScript = withdrawBox.propositionBytes == initialShares(providedWithdrawIndex)(1)
		
		val validWithdrawTokens = withdrawBox.tokens(0)._1 == initialTokenList(providedWithdrawIndex) && withdrawBox.tokens(0)._2 >= initialTokenAmount
		
		val filteredWithdrawInitialTokens = slicedInitialTokens.filter{
			(token: (Coll[Byte], Long)) => token(0) != initialTokenList(providedWithdrawIndex)
		}
		val filteredWithdrawFinalTokens = slicedFinalTokens.filter{
			(token: (Coll[Byte], Long)) => token(0) != initialTokenList(providedWithdrawIndex)
		}
		
		val validSuccessorWithdrawnTokens = filteredWithdrawInitialTokens == filteredWithdrawFinalTokens
		
		validWithdrawScript && validWithdrawTokens && validSuccessorWithdrawnTokens
	} else { false }
	
	val validWithdraw = (
		validSwampAudioScript &&
		validSwampValue &&
		withdrawBoxConditions &&
		validRegisters &&
		validSelfSuccessorScript &&
		validDeltaERG 
		
	)
	
	sigmaProp(
		validDeposit ||
		validSaleCombine ||
		validWithdraw
	)
}`;