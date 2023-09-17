
export const WITHDRAW_TOKEN_TEMPLATE =`{
	val swampAudioNode = PK("9iAp6nJugJciwfZK5rDt4civh4jnnT13j4fXoBLqscC7GRbpt5s").propBytes
	val withdrawFee    = 10000000L
	
	val initialWithdrawalTokens = SELF.tokens
	val tokenOwners             = SELF.R7[Coll[(Long,Coll[Byte])]].get
	
	val swampAudioBox = OUTPUTS(0)
	val withdrawalBox = OUTPUTS(1)
	val successor     = OUTPUTS(2)
	
	val tokenIndex = withdrawalBox.R4[Int].get
	
	val finalTokenOwners      = successor.R7[Coll[(Long,Coll[Byte])]].get
	
	val validSwampAudioScript = swampAudioBox.propositionBytes == swampAudioNode
	val validSwampValue       = swampAudioBox.value >= withdrawFee
	
	val validWithdrawalScript = withdrawalBox.propositionBytes == tokenOwners(tokenIndex)(1)
	val validWithdrawAmount = withdrawalBox.tokens(0)._1 == initialWithdrawalTokens(0)._1 && withdrawalBox.tokens(0)._2 == 1

	val validSuccessorScript = successor.propositionBytes == SELF.propositionBytes
	val validSuccessorValue  = successor.value >= SELF.value
	val validSuccesorTokens  = if (initialWithdrawalTokens(0)._2 > 1) {
		val finalWithdrawalTokens = successor.tokens(0)
        finalWithdrawalTokens._2 == initialWithdrawalTokens(0)._2 - 1 &&
        finalWithdrawalTokens._1 == initialWithdrawalTokens(0)._1
	} else {true}
	val validSuccessorOwners = tokenOwners.slice(0,tokenIndex).append(tokenOwners.slice(tokenIndex + 1, tokenOwners.size)) == finalTokenOwners
	
	sigmaProp(
		validSwampAudioScript &&
		validSwampValue &&
		validWithdrawalScript &&
		validWithdrawAmount &&
		validSuccessorScript &&
		validSuccessorValue &&
		validSuccesorTokens &&
		validSuccessorOwners 
		)
	}`;