export const INDICATION_TO_WITHDRAW_TEMPLATE = {
{
	val swampAudioNode = PK("9hKFHa886348VhfM1BRfLPKi8wwXMnyVqqmri9p5zPFE8qgMMui").propBytes
	val withdrawFee    = 10000000L
	
	val initialWithdrawalTokens = SELF.tokens(0)
	val tokenOwners             = SELF.R4[Coll[(Long,Coll[Byte])]].get
	val mintTokenDetails        = SELF.R5[(Coll[Byte],Long)].get
	
	val successor     = OUTPUTS(0)
	
	val finalTokenOwners      = successor.R4[Coll[(Long,Coll[Byte])]].get
	val finalMintTokenDetails = successor.R5[(Coll[Byte],Long)].get

	val swampAudioBox = OUTPUTS(1)
	 if (swampAudioBox.propositionBytes == swampAudioNode) { 
		// withdrawal
		val withdrawalBox = OUTPUTS(2)
		
		val tokenIndex = withdrawalBox.R4[Int].get
		
		val validSwampAudioScript = swampAudioBox.propositionBytes == swampAudioNode
		val validSwampValue       = swampAudioBox.value >= withdrawFee
		
		val validWithdrawalScript = withdrawalBox.propositionBytes == tokenOwners(tokenIndex)(1)
		val validWithdrawAmount   = withdrawalBox.tokens(0)._1 == initialWithdrawalTokens._1 && withdrawalBox.tokens(0)._2 == 1

		val validSuccessorScript = successor.propositionBytes == SELF.propositionBytes
		val validSuccessorValue  = successor.value >= SELF.value
		val validSuccesorTokens  = if (initialWithdrawalTokens._2 > 1) {
			val finalWithdrawalTokens = successor.tokens(0)
			finalWithdrawalTokens._2 == initialWithdrawalTokens._2 - 1 &&
			finalWithdrawalTokens._1 == initialWithdrawalTokens._1
		} else {true}
		val validSuccessorOwners = tokenOwners.slice(0,tokenIndex).append(tokenOwners.slice(tokenIndex + 1, tokenOwners.size)) == finalTokenOwners
		val validMintDetails     = mintTokenDetails == finalMintTokenDetails
		val withdrawAllowed      = initialWithdrawalTokens._2 != mintTokenDetails._2 && initialWithdrawalTokens._1 == mintTokenDetails._1
		
		sigmaProp(
			validSwampAudioScript &&
			validSwampValue &&
			validWithdrawalScript &&
			validWithdrawAmount &&
			validSuccessorScript &&
			validSuccessorValue &&
			validSuccesorTokens &&
			validSuccessorOwners &&
			validMintDetails &&
			withdrawAllowed
		)
	} else {
		// deposit
		val finalWithdrawalTokens = successor.tokens(0)
		
		val slicedInitialOwners = tokenOwners.slice(0, tokenOwners.size) // Needed because comparison doesnt work without slicing
		val slicedFinalOwners   = finalTokenOwners.slice(0, tokenOwners.size) 
		
		val validSuccessorScript = successor.propositionBytes == SELF.propositionBytes
		val validSuccessorValue  = successor.value >= SELF.value
		val validSuccesorTokens  = finalWithdrawalTokens._2 == initialWithdrawalTokens._2 + 1 && finalWithdrawalTokens._1 == initialWithdrawalTokens._1
		val validFinalOwners     = slicedFinalOwners == slicedInitialOwners && finalTokenOwners.size == tokenOwners.size + 1 
		val validMintDetails     = mintTokenDetails == finalMintTokenDetails
		sigmaProp(
			validSuccessorScript &&
			validSuccessorValue &&
			validSuccesorTokens &&
			validFinalOwners &&
			validMintDetails &&
			HEIGHT < 1667857691 // trivial condition for uniqueness		

		)
	}

}
};