import React, { useState } from 'react';
import { utf8, blake2b256, SColl, SByte, SigmaCompilerObj } from '@fleet-sdk/compiler';  
import bs58 from 'bs58';
import { BOOTSTRAP_TEMPLATE, INDICATION_TO_WITHDRAW_TEMPLATE, SALE_TEMPLATE, WITHDRAW_TOKEN_TEMPLATE } from '../contracts';

const ContractCompiler: React.FC = () => {
    // State for contract templates
    const [bootstrapScript, setBootstrapScript] = useState<string>(BOOTSTRAP_TEMPLATE);
    const [indicationToWithdrawScript, setIndicationToWithdrawScript] = useState<string>(INDICATION_TO_WITHDRAW_TEMPLATE);
    const [saleScript, setSaleScript] = useState<string>(SALE_TEMPLATE);
    const [withdrawTokenScript, setWithdrawTokenScript] = useState<string>(WITHDRAW_TOKEN_TEMPLATE);

    // Other state variables
    const [timestamp, setTimestamp] = useState<number>(Date.now());
    const [compiledBootstrap, setCompiledBootstrap] = useState<string | null>(null);
    const [compiledIndicationToWithdraw, setCompiledIndicationToWithdraw] = useState<string | null>(null);  
    const [compiledSale, setCompiledSale] = useState<string | null>(null); 
    const [compiledWithdrawToken, setCompiledWithdrawToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenId, setTokenId] = useState<string>("");
const [sharesAmount, setSharesAmount] = useState<number>(0);
const [saleAmount, setSaleAmount] = useState<number>(0);



// Helper Function: compileToP2S
async function compileToP2S(script, sigmaCompiler) {
    // Using Fleet SDK's SigmaCompilerObj for compilation
    const p2sAddress = await sigmaCompiler.compile(script);
    return p2sAddress;
  }
  
  // Helper Function: hashAndConvertToBase58
  function hashAndConvertToBase58(p2sAddress) {
    // Using Fleet SDK's blake2b256 for hashing
    const ergoTree = p2sAddress.toErgoTree();  // Assuming p2sAddress has a method to convert to ErgoTree
    const hashedResult = blake2b256(ergoTree);
    const base58Result = bs58.encode(Buffer.from(hashedResult, 'hex'));
    return base58Result;
  }
  
  // Main Compilation Function: handleComplexCompile
  async function handleComplexCompile() {
    setIsLoading(true);
    setError(null);
    const modifiedBootstrap = bootstrapScript
  .replace('$tokenId', tokenId)
  .replace('$sharesAmount', sharesAmount.toString())
  .replace('$saleAmount', saleAmount.toString());
    
    try {
      const sigmaCompiler = SigmaCompilerObj.forMainnet();
      const currentTimestamp = Date.now();
      
      // Compile indicationToWithdraw and withdrawToken
      const p2sIndicationToWithdraw = await compileToP2S(indicationToWithdrawScript.replace('$timestampL', currentTimestamp.toString()), sigmaCompiler);
      const p2sWithdrawToken = await compileToP2S(withdrawTokenScript.replace('$timestampL', currentTimestamp.toString()), sigmaCompiler);
  
      // Hash and Replace in Sale
      const modifiedSale = saleScript.replace('$indicationToWithdrawBase58', hashAndConvertToBase58(p2sIndicationToWithdraw));
      
      // Compile Sale
      const p2sSale = await compileToP2S(modifiedSale, sigmaCompiler);
      
      // Hash and Replace in Bootstrap
      let modifiedBootstrap = bootstrapScript;
      modifiedBootstrap = modifiedBootstrap.replace('$withdrawTokenBase58', hashAndConvertToBase58(p2sWithdrawToken));
      modifiedBootstrap = modifiedBootstrap.replace('$saleBase58', hashAndConvertToBase58(p2sSale));
      
      // Compile Bootstrap
      const p2sBootstrap = await compileToP2S(modifiedBootstrap, sigmaCompiler);
  
      // Display or use the p2sBootstrap as needed
  
    } catch (err) {
      setError(`Compilation Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCompile = async () => {
    setIsLoading(true);
    setError(null);
    
    await handleComplexCompile();
  };

    return (
        <div>
        <h1>Compile Your Contract</h1>
        
        {/* User Input Form */}
        <div>
            <input 
                type="text" 
                placeholder="Token ID" 
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Shares Amount" 
                value={sharesAmount}
                onChange={(e) => setSharesAmount(Number(e.target.value))}
            />
            <input 
                type="number" 
                placeholder="Sale Amount" 
                value={saleAmount}
                onChange={(e) => setSaleAmount(Number(e.target.value))}
            />
        </div>

        <p>Timestamp being used: {timestamp}</p>
        <button onClick={handleCompile} disabled={isLoading}>Compile</button>
        {isLoading && <p>Compiling...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {compiledBootstrap && (
            <div>
                <h2>Compiled Bootstrap Contract:</h2>
                <p>{compiledBootstrap}</p>
                <button onClick={() => navigator.clipboard.writeText(compiledBootstrap)}>Copy to Clipboard</button>
            </div>
        )}
    </div>
    );
};

export default ContractCompiler;
