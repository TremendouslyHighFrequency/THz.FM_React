import React, { useEffect, useState } from 'react';
import { OutputBuilder, TransactionBuilder } from '@fleet-sdk/core';
import { SPair, SColl, SByte } from '@fleet-sdk/serializer';
import { sha256, utf8 } from '@fleet-sdk/crypto';
import axios from 'axios';

const grease_data = [
    {
        "NFT_Type": "Fitness Influencer Male",
        "Song to pair": " pump_up_the_jam.mp3 ",
        "File Name": "Character NFT MISC Fitness Influencer M1 V2.jpg",
        "NFT Name/Title": "Fitness Influencer #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeie3bnofgpul3dtnwrd2c3fch3tb572zqyzsrnznul5sjau3ohdenu",
        "IPFS CID Image": "ipfs://bafybeifuvgwwsraomvkxk7kz6asxgdhtu63nms5iav522s7jmhtzzrg3i",
        "Token ID": "76c592187a8eeaf2d4ebfbf35e957b12005d568e4530ef9dc658d91284c05c0f"
    },
    {
        "NFT_Type": "Fitness Influencer Male",
        "Song to pair": " pump_up_the_jam.mp3 ",
        "File Name": "Character NFT MISC Fitness Influencer M2 V2.jpg",
        "NFT Name/Title": "Fitness Influencer #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeie3bnofgpul3dtnwrd2c3fch3tb572zqyzsrnznul5sjau3ohdenu",
        "IPFS CID Image": "ipfs://bafybeicxdpq3txuleqphdk2xrnturwlwu5tlmd2gzub67bsdtsyjz53s3y",
        "Token ID": "6b703690054f60ed868864ef86c76b4df27629552cf497393b61601982ebdd3d"
    },
    {
        "NFT_Type": "Fitness Influencer Female",
        "Song to pair": "pump_up_the_jam.mp3",
        "File Name": "Character NFT MISC Fitness Influencer F1V2.jpg",
        "NFT Name/Title": "Fitness Influencer #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeie3bnofgpul3dtnwrd2c3fch3tb572zqyzsrnznul5sjau3ohdenu",
        "IPFS CID Image": "ipfs://bafybeifsssytfkuwo4d3p7ny3hanf6etheln7kb7zxaczzxl6njijggbfu",
        "Token ID": "dcbc6ca986628ac6a4a2f005c4cabf0b1b3d5e089084b41c7691ac8cffd6e5d1"
    },
    {
        "NFT_Type": "Fitness Influencer Female",
        "Song to pair": " pump_up_the_jam.mp3 ",
        "File Name": "Character NFT MISC Fitness Influencer f2 V2.jpg",
        "NFT Name/Title": "Fitness Influencer #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeie3bnofgpul3dtnwrd2c3fch3tb572zqyzsrnznul5sjau3ohdenu",
        "IPFS CID Image": "ipfs://bafybeicuojn6on7mocvsmj45x5ugrvvsgdyvfti7ylxcsoqye5vmgxa7a4",
        "Token ID": "3bfc7ac389b54fc3e9be8dbb7d2081ff439b6167fb40d0f53ce37b42ec56d67a"
    },
    {
        "NFT_Type": "Race Car Driver (Nascar)",
        "Song to pair": " Nascar Theme ",
        "File Name": "Character NFT MISC Nascar Driver M1 V2.jpg",
        "NFT Name/Title": "Nascar Driver #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeic6czrt72jntlnoukxdmf7tedwsthhh4vfocfrp7kd3zioyzglcsa",
        "IPFS CID Image": "ipfs://bafybeicbsmtr6og5kn2ed4zwa6khzlnh4sjlp2ib2cr6eqbdnhfryd7nci",
        "Token ID": "a6e937612b9685beecf921d609e87e909d265ce6b506288956c9bcd06e908071"
    },
    {
        "NFT_Type": "Race Car Driver (Nascar)",
        "Song to pair": " Nascar Theme ",
        "File Name": "Character NFT MISC Nascar Driver M2 V2.jpg",
        "NFT Name/Title": "Nascar Driver #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeic6czrt72jntlnoukxdmf7tedwsthhh4vfocfrp7kd3zioyzglcsa",
        "IPFS CID Image": "ipfs://bafybeicgypkzxo535n36pz6crybvkbhdywmcfbi55qbp6npmxxmemldlxi",
        "Token ID": "970af731a545b7e8d663b4dd293294608cc524f6e152fb1588936a622b7a2878"
    },
    {
        "NFT_Type": "Race Car Driver (Nascar)",
        "Song to pair": " Nascar Theme ",
        "File Name": "Character NFT MISC Nascar Driver F1 V2.jpg",
        "NFT Name/Title": "Nascar Driver #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeic6czrt72jntlnoukxdmf7tedwsthhh4vfocfrp7kd3zioyzglcsa",
        "IPFS CID Image": "ipfs://bafybeiba37ce2f7c2ozbfk22yxlnz6cjy6cabuig4n5pmxdxfehp5m4bry",
        "Token ID": "ec79ac9d3dda5da2f1e666dc1ddbd6a96f480f81f1f346e2821074b057dcfd64"
    },
    {
        "NFT_Type": "Race Car Driver (Nascar)",
        "Song to pair": " Nascar Theme ",
        "File Name": "Character NFT MISC Nascar Driver F2 V2.jpg",
        "NFT Name/Title": "Nascar Driver #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeic6czrt72jntlnoukxdmf7tedwsthhh4vfocfrp7kd3zioyzglcsa",
        "IPFS CID Image": "ipfs://bafybeif7xwjtekobm2inj7yzjxdmkhirqz5v4kcggpj3eq24rcrrpl54be",
        "Token ID": "f02f43aa847489495b93d9a85aa59ad4fe6841a3643d330a5c490ddede4d3df4"
    },
    {
        "NFT_Type": "Skater Guy",
        "Song to pair": "Jerry was a racecar driver",
        "File Name": "Character NFT MISC Skateboarder 1 V2.jpg",
        "NFT Name/Title": "Skateboarder #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiglug54egzbohzdqmmfjfte2a6yzgc5wobaqfm6ptu4tusbp7lgha",
        "IPFS CID Image": "ipfs://bafybeigmsw2sr2rd4e72kcivvycqifk76v5al4nf57ucfpk7b4bzf7ecva",
        "Token ID": "ba9ad975b0a1090c6a8b1b5fd7430e9a472059b3ce50ffc72baeb85fac8e728d"
    },
    {
        "NFT_Type": "Skater Guy",
        "Song to pair": "Jerry was a racecar driver",
        "File Name": "Character NFT MISC Skateboarder 2 V2.jpg",
        "NFT Name/Title": "Skateboarder #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiglug54egzbohzdqmmfjfte2a6yzgc5wobaqfm6ptu4tusbp7lgha",
        "IPFS CID Image": "ipfs://bafybeidznifpazsdn7zwduozsstkkqvdftjpv3m5flkhbbrqpof3czezs4",
        "Token ID": "fc07800e83c45a62423632116e07c3cbcf935b8a31a932a73e4abde0eddad4c7"
    },
    {
        "NFT_Type": "Skater Guy",
        "Song to pair": "Jerry was a racecar driver",
        "File Name": "Character NFT MISC Skateboarder 3 V2.jpg",
        "NFT Name/Title": "Skateboarder #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiglug54egzbohzdqmmfjfte2a6yzgc5wobaqfm6ptu4tusbp7lgha",
        "IPFS CID Image": "ipfs://bafybeidwkngc3eyfklrz6r4fy3wg47wjdvvaop4pbv6ls33mjwhpsn3hya",
        "Token ID": "5f165f0979dcd553e900052ff3ccd96fbd23ae5dc7a9fa80be125e6d1784165f"
    },
    {
        "NFT_Type": "Homeless Guy",
        "Song to pair": " Pearl Jam Even Flow ",
        "File Name": "Character NFT MISC URBAN CAMPER 1 V2.jpg",
        "NFT Name/Title": "Urban Camper #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiapbexgnmy6dqu7lwsf2wdkunx72ve7fmtsh6griipj5uws6cldki",
        "IPFS CID Image": "ipfs://bafybeihx4ibxqg2mllelpxbvx6kniukqsc6dpyzmt6e7hqow3jfr2h5zdq",
        "Token ID": "fc17706dc7d2eaad1945d0aae6cf35854d56beec33059a71c097b8e21cfd26ad"
    },
    {
        "NFT_Type": "Homeless Guy",
        "Song to pair": " Pearl Jam Even Flow ",
        "File Name": "Character NFT MISC URBAN CAMPER 2 V2.jpg",
        "NFT Name/Title": "Urban Camper #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiapbexgnmy6dqu7lwsf2wdkunx72ve7fmtsh6griipj5uws6cldki",
        "IPFS CID Image": "ipfs://bafybeig5gj3ntka3smhcnl5rjaloxkvn5zmauz3akuwoz7sjmz3mwrp35y",
        "Token ID": "da79c5468b5d1ae21062894158bf32338cf39584597e9cb552d9b3ef42c800bd"
    },
    {
        "NFT_Type": "Homeless Guy",
        "Song to pair": " Pearl Jam Even Flow ",
        "File Name": "Character NFT MISC URBAN CAMPER 3 V2.jpg",
        "NFT Name/Title": "Urban Camper #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiapbexgnmy6dqu7lwsf2wdkunx72ve7fmtsh6griipj5uws6cldki",
        "IPFS CID Image": "ipfs://bafybeicfxvc7vkujaybcqpszwhptbfgovfiupod6l6bkiq42i56dhz6g7a",
        "Token ID": "d2eea70b2e2b80d8b8bfcea5fe38c731ff01c851bae80dd70f3b2c82df5e3fea"
    },
    {
        "NFT_Type": "Homeless Guy",
        "Song to pair": " Pearl Jam Even Flow ",
        "File Name": "Character NFT MISC URBAN CAMPER 4 V2.jpg",
        "NFT Name/Title": "Urban Camper #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiapbexgnmy6dqu7lwsf2wdkunx72ve7fmtsh6griipj5uws6cldki",
        "IPFS CID Image": "ipfs://bafybeiadktnnkcq65glhms66f7zks3e5v5dfagz37hevo7xhec5jtvoche",
        "Token ID": "b261ad269773c2a2a0bffcfef7f29a729db9dc6f79326b994ddb0912d3123405"
    },
    {
        "NFT_Type": "Rapper Male",
        "Song to pair": "90's Hip Hop Beat",
        "File Name": "Character NFT MISC Rapper M1 V2.jpg",
        "NFT Name/Title": "Rapper #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahngoddny42dgapnnzwxkx7wzdtefpnzmpixk6ub6ocdht4dcsbu",
        "IPFS CID Image": "ipfs://bafybeicr7v7nd7eemqtihcaeftafnorofhmwpqwcgdf6wumhr2kizivmre",
        "Token ID": "184900e28f37f3d5b90e43c686580512d04a4ed87c447bb732adde1b3af39a8f"
    },
    {
        "NFT_Type": "Rapper Male",
        "Song to pair": "90's Hip Hop Beat",
        "File Name": "Character NFT MISC Rapper M2 V2.jpg",
        "NFT Name/Title": "Rapper #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahngoddny42dgapnnzwxkx7wzdtefpnzmpixk6ub6ocdht4dcsbu",
        "IPFS CID Image": "ipfs://bafybeigsbtsvf7yxjx5qtksu2fmiiiyd75ehh7oymypvtnef7zjb6szzk4",
        "Token ID": "730ec22e616efbf92b7d17548e085802fb21dddcaf9289f0b8f00695fc7251a0"
    },
    {
        "NFT_Type": "Rapper Female",
        "Song to pair": "90's Hip Hop Beat",
        "File Name": "Character NFT MISC Rapper F1 V2.jpg",
        "NFT Name/Title": "Rapper #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahngoddny42dgapnnzwxkx7wzdtefpnzmpixk6ub6ocdht4dcsbu",
        "IPFS CID Image": "ipfs://bafybeibktefo7tryzb5w5fn66ywl2vtcmeapncqtcoonelpaudnngosj2i",
        "Token ID": "bfe09d32788e7c4b251116c8e176e9c5e6211354eae9df9f551b66f16bb0ce1b"
    },
    {
        "NFT_Type": "Rapper Female",
        "Song to pair": "90's Hip Hop Beat",
        "File Name": "Character NFT MISC Rapper F2 V2.jpg",
        "NFT Name/Title": "Rapper #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahngoddny42dgapnnzwxkx7wzdtefpnzmpixk6ub6ocdht4dcsbu",
        "IPFS CID Image": "ipfs://bafybeich4yiuwib7nj4x6f2g4ml7fgpm55vp7wwasu36xebvrnsoygi4da",
        "Token ID": "a747e65b56552d7e2b3ea2b6bfa75d123147da6a52ec0b0f375c1a5b12faf382"
    },
    {
        "NFT_Type": "Cowboy",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowboy 1 V2.jpg",
        "NFT Name/Title": "Cowboy #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeibxni2aoevos3bmcqsmwalk37vaf532scoycegpw3w7os2zihv6ha",
        "Token ID": "fd3c371a122ff9b80e14ffe1fa2e24dc8b7e86993dae0948fb557a646f6bb6a8"
    },
    {
        "NFT_Type": "Cowboy",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowboy 2 V2.jpg",
        "NFT Name/Title": "Cowboy #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeiccoqhytj4xercylppcniwyj66x6fskynthcozombvtwbwgieatlq",
        "Token ID": "7e6b6ffe4df6885110df7419e7783831c8927b8be5cce2ac2052f713cf22fa5e"
    },
    {
        "NFT_Type": "Cowboy",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowboy 3 V2.jpg",
        "NFT Name/Title": "Cowboy #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeifzx5shqoculvoehhr4u3ibpfx6domqiq7xvcdi7qas56n7qh533i",
        "Token ID": "17fd22bc28e80f8e5359552ac859eff5c0095d95e08b8039fb35450dcc4db028"
    },
    {
        "NFT_Type": "Cowboy",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowboy 4 V2.jpg",
        "NFT Name/Title": "Cowboy #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeidcdtljj74hptivxobl32zlcyrko5lgojzfixqfcmdcln5yvyoe2y",
        "Token ID": "8f7a3d53f8247c33bfec9c62943d23a5575d66f4f1dd15f912d23358edede7b4"
    },
    {
        "NFT_Type": "CowGirl",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowgirl 1 V2.jpg",
        "NFT Name/Title": "Cowgirl #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeia6ml335pjmm7b7k76qegpghxl6schme6njjhxjzcmy7eq65slheq",
        "Token ID": "f2a3db584074c71afad768e4e35d42cc5f31076eda4ec52724e1980ab8027a6b"
    },
    {
        "NFT_Type": "CowGirl",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowgirl 2 V2.jpg",
        "NFT Name/Title": "Cowgirl #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeibhadebbl2rhntm52jiwefznvqhxccramyiwcegvt2tabgnmkihiu",
        "Token ID": "b56afcdc2d5e00a70db0f6368a8d3f03d016dcc3917d09102bf00c4adb94fffc"
    },
    {
        "NFT_Type": "CowGirl",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowgirl 3 V2.jpg",
        "NFT Name/Title": "Cowgirl #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeie4m3qhgo4grkahapa5wtp6bgj3rz3hjinyaeme3dcvrf6pfjl6wi",
        "Token ID": "43e167e6fdc9eafffcfb045e8263266aa5f3a6a6beadbf3973da7bf729f65486"
    },
    {
        "NFT_Type": "CowGirl",
        "Song to pair": "90's Country",
        "File Name": "Character NFT MISC Cowgirl 4 V2.jpg",
        "NFT Name/Title": "Cowgirl #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiahq6tnj7t4uoyfn7ibqlkzl5xu2xtriyaktz2czrcxyxejmvilji",
        "IPFS CID Image": "ipfs://bafybeice5wy2xkxzls5t52zckyo6b7wr6iaehx3aevljdr4xei5diwtgrm",
        "Token ID": "041ec3538d99b7e84e7cd04e478f96f4d25d195151b573a98fec10ac9db10e57"
    },
    {
        "NFT_Type": "Playboy Bunnies",
        "Song to pair": " Pour Some Sugar on me ",
        "File Name": "Character NFT MISC Playboy Bunny 1 V2.jpg",
        "NFT Name/Title": "Playboy Bunny #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajsn6s6mxu7qgf33nrpa4bwkceiojndh3kscnsoplp477l2qwumi",
        "IPFS CID Image": "ipfs://bafybeiaucfyv3wh6adsztmt5dsrv7wtfa2fup56ytxqe5pk5kvwtr6ejqu",
        "Token ID": "b56ce3b847e1e05700e0b023a3c0c6bd7f9d7bfa6a762cf09c23abe5423ff688"
    },
    {
        "NFT_Type": "Playboy Bunnies",
        "Song to pair": " Pour Some Sugar on me ",
        "File Name": "Character NFT MISC Playboy Bunny 2 V2.jpg",
        "NFT Name/Title": "Playboy Bunny #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajsn6s6mxu7qgf33nrpa4bwkceiojndh3kscnsoplp477l2qwumi",
        "IPFS CID Image": "ipfs://bafybeidmcunbstzw6kzri6bjjpbgke5jxbogjlmtf46qbvkmspdjqii4ai",
        "Token ID": "d22e7ae7774dee1b74c57547d261b09f0b61181ec82f3d1844fc25c6945aa48f"
    },
    {
        "NFT_Type": "Playboy Bunnies",
        "Song to pair": " Pour Some Sugar on me ",
        "File Name": "Character NFT MISC Playboy Bunny 3 V2.jpg",
        "NFT Name/Title": "Playboy Bunny #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajsn6s6mxu7qgf33nrpa4bwkceiojndh3kscnsoplp477l2qwumi",
        "IPFS CID Image": "ipfs://bafybeifawqkh3fnmdfd625xtrvq3ol2iyshwi7vtkdlg6xoqzmdr757qr4",
        "Token ID": "46fe84028e40bf1fdbe6822b38954a2c98431b7b820ed2c71f2518d81eb244dd"
    },
    {
        "NFT_Type": "Chippendales",
        "Song to pair": " Pour Some Sugar on me ",
        "File Name": "Character NFT MISC Cchippendale 1 V2.jpg",
        "NFT Name/Title": "Chippendale #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajsn6s6mxu7qgf33nrpa4bwkceiojndh3kscnsoplp477l2qwumi",
        "IPFS CID Image": "ipfs://bafybeid3xn6eiu2fc4edbx36cj4daqhs5tkfdbaxrlhghxwn44c7vfrnxq",
        "Token ID": "86d77089293e59beb9b900cc186189a3ed640fb5d2a3958a67776f5359074dd0"
    },
    {
        "NFT_Type": "Chippendales",
        "Song to pair": " Pour Some Sugar on me ",
        "File Name": "Character NFT MISC Chippendale 2 V2.jpg",
        "NFT Name/Title": "Chippendale #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajsn6s6mxu7qgf33nrpa4bwkceiojndh3kscnsoplp477l2qwumi",
        "IPFS CID Image": "ipfs://bafybeih7xxvk7ibpmxu62aj4yjc32cluxyl7szm52qu65b7lev52adlfxy",
        "Token ID": "d5ea5f60dad7dbb7bfd2b4084b75a2c16d098f82ca306e1241bdb74a3ff4553f"
    },
    {
        "NFT_Type": "Chippendales",
        "Song to pair": " Pour Some Sugar on me ",
        "File Name": "Character NFT MISC Chippendale 3 V2.jpg",
        "NFT Name/Title": "Chippendale #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajsn6s6mxu7qgf33nrpa4bwkceiojndh3kscnsoplp477l2qwumi",
        "IPFS CID Image": "ipfs://bafybeigadlce6xngssdqqj53v6fwdlr3i3pwscdsnjngiqykcvdvrktuny",
        "Token ID": "ff7b40bdceef84aeacb2e72f2ca8ddd50d5038aceb9c8eea77048ce42043be38"
    },
    {
        "NFT_Type": "Punk Rocker Male",
        "Song to pair": " Ramones Blitzkrieg Blop  ",
        "File Name": "Character NFT MISC Punk Rocker M1 V2.jpg",
        "NFT Name/Title": "Punk Rocker #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifstltillsbbursaotrspzozuaizcu23obutkp2t65kjua6mkilpa",
        "IPFS CID Image": "ipfs://bafybeid6mk45rw2jjgd4tdiontx5xn35zahleds7xqtpikqtre46hr6fhy",
        "Token ID": "c805b09778dbdf645cdbd2457fbd3e2ecfe520c04d384a3c04d178691e937631"
    },
    {
        "NFT_Type": "Punk Rocker Male",
        "Song to pair": " Ramones Blitzkrieg Blop  ",
        "File Name": "Character NFT MISC Punk Rocker M2 V2.jpg",
        "NFT Name/Title": "Punk Rocker #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifstltillsbbursaotrspzozuaizcu23obutkp2t65kjua6mkilpa",
        "IPFS CID Image": "ipfs://bafybeih32ydz3hzgyx3xij2eaiwswxmiedwk25zti23ywzvliz5riuojzy",
        "Token ID": "d35d9b9c25485801814459df9918d47761c20835959582ff9faacc928bedfbec"
    },
    {
        "NFT_Type": "Punk Rocker Male",
        "Song to pair": " Ramones Blitzkrieg Blop  ",
        "File Name": "Character NFT MISC Punk Rocker M3 V2.jpg",
        "NFT Name/Title": "Punk Rocker #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifstltillsbbursaotrspzozuaizcu23obutkp2t65kjua6mkilpa",
        "IPFS CID Image": "ipfs://bafybeic35gneqqibufkpueev62vv3m37fg3ps3ezgugzzr757ifybzoktu",
        "Token ID": "e9e4f4e85d21e59486821dc1d1259bca5afc29265be4019d4a6afadb950fdce4"
    },
    {
        "NFT_Type": "Punk Rocker Male",
        "Song to pair": " Ramones Blitzkrieg Blop  ",
        "File Name": "Character NFT MISC Punk Rocker M4 V2.jpg",
        "NFT Name/Title": "Punk Rocker #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifstltillsbbursaotrspzozuaizcu23obutkp2t65kjua6mkilpa",
        "IPFS CID Image": "ipfs://bafybeibw6rnpcuwkvgez6euc6ty3rdoic5kzqpoql5kszl3wdofr7vdbh4",
        "Token ID": "6e7ddfdd30a3964535581b74fc324a41288d9a92be15bb0e245e5138b65219ae"
    },
    {
        "NFT_Type": "Punk Rocker Female",
        "Song to pair": " I love Rock n Roll ",
        "File Name": "Character NFT MISC Punk Rocker F1 V2.jpg",
        "NFT Name/Title": "Punk Rocker #5",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajlvdhtpuddfsbts443dewvy46jx7t7ytk2voks54s5cclcn5sj4",
        "IPFS CID Image": "ipfs://bafybeibzg6h45ggombf2xfidcgd5d2vynvdi4sxa3rjdfhadrtj4hb7d3q",
        "Token ID": "3119a87607ed620f1a5b60648805c5e6d994154635a57e8f62cbc3f7637ed9eb"
    },
    {
        "NFT_Type": "Punk Rocker Female",
        "Song to pair": " I love Rock n Roll ",
        "File Name": "Character NFT MISC Punk Rocker F2 V2.jpg",
        "NFT Name/Title": "Punk Rocker #6",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajlvdhtpuddfsbts443dewvy46jx7t7ytk2voks54s5cclcn5sj4",
        "IPFS CID Image": "ipfs://bafybeicc7azqgaw5dh6n3zf6i5ikvbgsecb7ntp5xtrebgxhavd7zu6id4",
        "Token ID": "e4b156bf1f416965dc88ec7ad3a7ccef26717d0bcaa219a8866a3c4c4a4e82c3"
    },
    {
        "NFT_Type": "Punk Rocker Female",
        "Song to pair": " I love Rock n Roll ",
        "File Name": "Character NFT MISC Punk Rocker F3 V2.jpg",
        "NFT Name/Title": "Punk Rocker #7",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajlvdhtpuddfsbts443dewvy46jx7t7ytk2voks54s5cclcn5sj4",
        "IPFS CID Image": "ipfs://bafybeigbktcgfgwbdx7ytmg3kfl7d6spifuamgtw5hwy52g3h3pyjulpli",
        "Token ID": "0a10167bb9b0ac2d2cffb7718e452fc22cb6e0f450b224e9e183ff62f023f60d"
    },
    {
        "NFT_Type": "Punk Rocker Female",
        "Song to pair": " I love Rock n Roll ",
        "File Name": "Character NFT MISC Punk Rocker F4 V2.jpg",
        "NFT Name/Title": "Punk Rocker #8",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeiajlvdhtpuddfsbts443dewvy46jx7t7ytk2voks54s5cclcn5sj4",
        "IPFS CID Image": "ipfs://bafybeibhqgfkkaa2asem67ukluhsoqp2cdrpkeve5fnnvchjdp3eczgnma",
        "Token ID": "5d3c7c1f2c3b113085a9b627c28db9b8b0912b1e403b5b648ea3799f4655b3b0"
    },
    {
        "NFT_Type": "Surfer ",
        "Song to pair": " Wipe Out ",
        "File Name": "Character NFT MISC Surfer F1 V2.jpg",
        "NFT Name/Title": "Surfer #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeieneipmrqeuzqssika4vedtxvlhxlitqibdcemzcur2fqap3a2fnq",
        "IPFS CID Image": "ipfs://bafybeig55oe2gavdgbcnhb5nrpjxt4jlop2dvra6odihnerpigsqqjhr2q",
        "Token ID": "fe92da810d72a75331f3d5ebd0fb1acb91745313c950783835d0e70e7caa36bf"
    },
    {
        "NFT_Type": "Surfer ",
        "Song to pair": " Wipe Out ",
        "File Name": "Character NFT MISC Surfer F2 V2.jpg",
        "NFT Name/Title": "Surfer #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeieneipmrqeuzqssika4vedtxvlhxlitqibdcemzcur2fqap3a2fnq",
        "IPFS CID Image": "ipfs://bafybeic7ojtj7kbczxipzvdvhlng3rtprjgdxekozfnxwtsrvibipq4zue",
        "Token ID": "d2bbf5ec7e352a2f28f327cb57002cc33964963d6927f2292a62247a6e00c3da"
    },
    {
        "NFT_Type": "Surfer ",
        "Song to pair": " Wipe Out ",
        "File Name": "Character NFT MISC Surfer M1 V2.jpg",
        "NFT Name/Title": "Surfer #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeieneipmrqeuzqssika4vedtxvlhxlitqibdcemzcur2fqap3a2fnq",
        "IPFS CID Image": "ipfs://bafybeicbo45uujys7c7drzs7porysz4zqxiyuxfyxoagoimsy3cpsxfg2q",
        "Token ID": "a7e4fcd4642ec99f42eda7808318a96051fcd7732fdface2c877e1e1de34805e"
    },
    {
        "NFT_Type": "Surfer ",
        "Song to pair": " Wipe Out ",
        "File Name": "Character NFT MISC Surfer M2 V2.jpg",
        "NFT Name/Title": "Surfer #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeieneipmrqeuzqssika4vedtxvlhxlitqibdcemzcur2fqap3a2fnq",
        "IPFS CID Image": "ipfs://bafybeied5622o4ayh3e7nr7ueocsgz5yk6eq6zsnolrvlyjpnq7hz523au",
        "Token ID": "2b731c26c6948cfa6d0b12fa567ebafc448fb9c741aa8c0887d28a7a80cfe984"
    },
    {
        "NFT_Type": "DJ ( With Helmets)",
        "Song to pair": " Around the World ",
        "File Name": "Character NFT MISC DJ 1 V2.jpg",
        "NFT Name/Title": "DJ #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidll2vi75z6cdeokcxkla5cxwxqnrdqkyywriewinq4q2bscpn4zq",
        "IPFS CID Image": "ipfs://bafybeidbmgmlkj3cib6dlkyfcwvol6zlpkrvfqw2ks44yabbmsopeslfiq",
        "Token ID": "a4e89c5becdf18c301655cb39bdba27d6258f478305a3d6f4c12938e2981012a"
    },
    {
        "NFT_Type": "DJ ( With Helmets)",
        "Song to pair": " Around the World ",
        "File Name": "Character NFT MISC DJ 2 V2.jpg",
        "NFT Name/Title": "DJ #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidll2vi75z6cdeokcxkla5cxwxqnrdqkyywriewinq4q2bscpn4zq",
        "IPFS CID Image": "ipfs://bafybeic27bcj2a7nsxjbjnz3krvgmj64jxyqrf37ynnb4iwibotzbpcqce",
        "Token ID": "fcfa8eab33dd2d79f55e073b362991e39572a536e757a1bafb0291ae5e7a054e"
    },
    {
        "NFT_Type": "DJ ( With Helmets)",
        "Song to pair": " Around the World ",
        "File Name": "Character NFT MISC DJ 3 V2.jpg",
        "NFT Name/Title": "DJ #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidll2vi75z6cdeokcxkla5cxwxqnrdqkyywriewinq4q2bscpn4zq",
        "IPFS CID Image": "ipfs://bafybeib4xogcimnfvbr53djtetdk6xgcvmir5mv2wts55vxycpebluez2a",
        "Token ID": "7c07a54287586238a0649fe444c3b2be03339dd75ad902fcf85e8e2850ee5294"
    },
    {
        "NFT_Type": "DJ ( With Helmets)",
        "Song to pair": " Around the World ",
        "File Name": "Character NFT MISC DJ 4 V2.jpg",
        "NFT Name/Title": "DJ #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidll2vi75z6cdeokcxkla5cxwxqnrdqkyywriewinq4q2bscpn4zq",
        "IPFS CID Image": "ipfs://bafybeiazjmtflgeaumjxormbw6drnujkmc6z3vq56r6g3dprhakjzepr3a",
        "Token ID": "8b72babfeba93527e467c72c13d077d5b93dd9c7d48f988cc86e0b419f329310"
    },
    {
        "NFT_Type": "McDonalds Worker Male",
        "Song to pair": " McDonalds Theme ",
        "File Name": "Character NFT MISC MCD Worker M1 V2.jpg",
        "NFT Name/Title": "Fast Food Worker #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafkreiczzme2lbpwi65r6lii6zgewvv4l4wm5titinyvgcks2qt357w6t4",
        "IPFS CID Image": "ipfs://bafybeifmzzjt7skwn6jivwhuktrpf6cw4jt32uotwcnmox3kmkzxkwen4q",
        "Token ID": "cff86ad47eca54121a45931e7e5e5c0fa3f686e19c9ddb8a9df347280658ac7a"
    },
    {
        "NFT_Type": "McDonalds Worker Male",
        "Song to pair": " McDonalds Theme ",
        "File Name": "Character NFT MISC MCD Worker M2 V2.jpg",
        "NFT Name/Title": "Fast Food Worker #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafkreiczzme2lbpwi65r6lii6zgewvv4l4wm5titinyvgcks2qt357w6t4",
        "IPFS CID Image": "ipfs://bafybeiagejiczqrsgjxithwokmjnscn24qdp4uyknkhcxwsxdwy5ymm7ri",
        "Token ID": "c52a4170bae4297ce9632a151cebb696c6060c71b81d03e3cca162e468bda37a"
    },
    {
        "NFT_Type": "McDonalds Worker Male",
        "Song to pair": " McDonalds Theme ",
        "File Name": "Character NFT MISC MCD Worker M3 V2.jpg",
        "NFT Name/Title": "Fast Food Worker #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafkreiczzme2lbpwi65r6lii6zgewvv4l4wm5titinyvgcks2qt357w6t4",
        "IPFS CID Image": "ipfs://bafybeibwcjr5wwz5gddero73r6tbsoh4l4kijtfnrvm2iiaf3vbtt4xkr4",
        "Token ID": "6e4cfeae81700d9586efa1cdf5d0ecad6fbe32fd8cea8ca11e8ff5c33afa19cf"
    },
    {
        "NFT_Type": "McDonalds Worker Female",
        "Song to pair": " McDonalds Theme ",
        "File Name": "Character NFT MISC MCD Worker F1 V2.jpg",
        "NFT Name/Title": "Fast Food Worker #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafkreiczzme2lbpwi65r6lii6zgewvv4l4wm5titinyvgcks2qt357w6t4",
        "IPFS CID Image": "ipfs://bafybeiewcesh33rvnecphh5zivyxw5s4gx5vjnevxzebdhypa5terezfcm",
        "Token ID": "963419afeb7965e103c5cb9560f3547c7a61c187a282e975095ceab71ef2f3fa"
    },
    {
        "NFT_Type": "McDonalds Worker Female",
        "Song to pair": " McDonalds Theme ",
        "File Name": "Character NFT MISC MCD Worker F2 V2.jpg",
        "NFT Name/Title": "Fast Food Worker #5",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafkreiczzme2lbpwi65r6lii6zgewvv4l4wm5titinyvgcks2qt357w6t4",
        "IPFS CID Image": "ipfs://bafybeih4qbhyty6pxftjuh3idblyjv7fknfsekz4thyuyqhe2yoij3afsu",
        "Token ID": "f2b7b4bcc19f8e9c369820c2e9937647b2cc9053391d5024525e8f83a201a68e"
    },
    {
        "NFT_Type": "McDonalds Worker Female",
        "Song to pair": " McDonalds Theme ",
        "File Name": "Character NFT MISC MCD Worker F3 V2.jpg",
        "NFT Name/Title": "Fast Food Worker #6",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafkreiczzme2lbpwi65r6lii6zgewvv4l4wm5titinyvgcks2qt357w6t4",
        "IPFS CID Image": "ipfs://bafybeiauirddh75tor3b6ktgqsgdoyvhns43ovffbwafl7nalg4k3djdii",
        "Token ID": "f0ce3536a2eed0e4f0a05969a5c3d698803ca283b057f8dc3fef9382a1d323b8"
    },
    {
        "NFT_Type": "Astronaut",
        "Song to pair": "Avatar.mp3",
        "File Name": "Character NFT MISC Astronaut F1 V2.jpg",
        "NFT Name/Title": "Astronaut #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid7nldn4cxkfflpla3vvpw72fc3fjt6u53kotqzjr6vidxexf2ggm",
        "IPFS CID Image": "ipfs://bafybeiaaphcpxa2cmkjbohx2qboezen73tku5zesoypi52exgrck3qrhme",
        "Token ID": "b4d1e3e26b15e8bc68b9b5775b2f42b2370c7dd86f994d879a9adcb4dd995198"
    },
    {
        "NFT_Type": "Astronaut",
        "Song to pair": "Avatar.mp3",
        "File Name": "Character NFT MISC Astronaut F2 V2.jpg",
        "NFT Name/Title": "Astronaut #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid7nldn4cxkfflpla3vvpw72fc3fjt6u53kotqzjr6vidxexf2ggm",
        "IPFS CID Image": "ipfs://bafybeigtvmyegrxyydzohbacprqxkcuekqzbwgjqt76ocsktwbr23evbni",
        "Token ID": "069e0c9f628ae21e5655132d7b1c41c90c872b61228bf3721b949f924c898a56"
    },
    {
        "NFT_Type": "Astronaut",
        "Song to pair": "Avatar.mp3",
        "File Name": "Character NFT MISC Astronaut M1 V2.jpg",
        "NFT Name/Title": "Astronaut #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid7nldn4cxkfflpla3vvpw72fc3fjt6u53kotqzjr6vidxexf2ggm",
        "Token ID": "c3c9021a5b3b8ad18a601053d8c4e9d88d3dfabdca3490ec80d829f5d3cc9f29",
        "IPFS CID Image": "ipfs://bafybeihxfpmm56xqhmxdrbsodflgkqihqelicruubbhowc3a22c7j6aqz4"
    },
    {
        "NFT_Type": "Astronaut",
        "Song to pair": "Avatar.mp3",
        "File Name": "Character NFT MISC Astronaut M2 V2.jpg",
        "NFT Name/Title": "Astronaut #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid7nldn4cxkfflpla3vvpw72fc3fjt6u53kotqzjr6vidxexf2ggm",
        "IPFS CID Image": "ipfs://bafybeiguvwrh4qj64dlnxhc45nkun2dqcnbtceehuakk2a4lthnejp2rnm",
        "Token ID": "daed62e845cd33ccb5623c944943fa54a4b0e8e0703462e018dc5a93cf5374b1"
    },
    {
        "NFT_Type": "Rollerblading Male",
        "Song to pair": "Don't You",
        "File Name": "Character NFT MISC Rollerblader M1 V2.jpg",
        "NFT Name/Title": "Rollerblader #1",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeicfp3xqazsyuo3ahkicbi57cylirk253xqr4y5dkitihpiv6banyu",
        "IPFS CID Image": "ipfs://bafybeibuvevhp2pbypypevnczgpq25l4ln3cambucajqjvudi4bacpcuty",
        "Token ID": "8c94792c4fffbe64f036b8ea35afca80473ed5ea11a450f58ac29cf5eadd1f49"
    },
    {
        "NFT_Type": "Rollerblading Male",
        "Song to pair": "Don't You",
        "File Name": "Character NFT MISC Rollerblader M2 V2.jpg",
        "NFT Name/Title": "Rollerblader #3",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeicfp3xqazsyuo3ahkicbi57cylirk253xqr4y5dkitihpiv6banyu",
        "IPFS CID Image": "ipfs://bafybeibti4vdc3ifqroxdakqaa7yavcytnhicxcj2cjrqogqxzvi7wvm7e",
        "Token ID": "5c31546c397f505fa16719972b54b3795025c5016ec5181aa0e47bc6ba00e0ad"
    },
    {
        "NFT_Type": "Rollerblading Female",
        "Song to pair": "Don't You",
        "File Name": "Character NFT MISC Rollerblader F1 V2.jpg",
        "NFT Name/Title": "Rollerblader #2",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeicfp3xqazsyuo3ahkicbi57cylirk253xqr4y5dkitihpiv6banyu",
        "IPFS CID Image": "ipfs://bafybeigzffjmx62kudirgel6yrz4mxebbgzwzethkyndxpvlqrlbzwcyi4",
        "Token ID": "dd37f404c33ff54f470eaffe34d85f6353a4939e9a6eb5f2fa4a3f9b3d4ad0e4"
    },
    {
        "NFT_Type": "Rollerblading Female",
        "Song to pair": "Don't You",
        "File Name": "Character NFT MISC Rollerblader F2 V2.jpg",
        "NFT Name/Title": "Rollerblader #4",
        "Description": "Greasy Royale Miscellaneous Character",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeicfp3xqazsyuo3ahkicbi57cylirk253xqr4y5dkitihpiv6banyu",
        "IPFS CID Image": "ipfs://bafybeiffgk3ramqd7du5uj6y626i7mee4rpbdlzoeqfrohr54bjygpttky",
        "Token ID": "ad1509bf2b2808249199543e70894da1787c8ba82d6a6b824f46554cf54647b0"
    },
    {
        "NFT_Type": "Prince",
        "Song to pair": " When Doves Cry ",
        "File Name": "Character NFT MISC Prince V2.jpg",
        "NFT Name/Title": "Prince",
        "Description": "Greasy Royale Pop Culture 1 of 5",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeigysmqbiinb7e3jjz4syvqgsj2qcz3tuwzwqtpinjo733mngpe3by",
        "IPFS CID Image": "ipfs://bafybeif5qnnv4ndlob6cvtzkpgge5wb3vckbbr7sdykcxaewnbeyqnqqjy",
        "Token ID": "2c9f140b0b42812112eafb5a2ff27cb7ab3289aa3c99ba07bae9194707257acd"
    },
    {
        "NFT_Type": "Madonna",
        "Song to pair": " Vogue ",
        "File Name": "Character NFT MISC Madonna V2.jpg",
        "NFT Name/Title": "Madonna",
        "Description": "Greasy Royale Pop Culture 2 of 5",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeigagsvu43vjosolfa7pvammoshrlrx4wq4ofd6fp52czf2y4mn7vi",
        "IPFS CID Image": "ipfs://bafybeig4uzmrvtves62swck6vxqdftriu4qz2upr2o63cjihn6oiemm2ru",
        "Token ID": "5d064f6bff5f9c6c33cfbd29b1b4a2ab4268a5fbd6927f5faa08178ac814277c"
    },
    {
        "NFT_Type": "David Bowie",
        "Song to pair": " Under Pressure ",
        "File Name": "Character NFT MISC David Bowie V2.jpg",
        "NFT Name/Title": "David Bowie",
        "Description": "Greasy Royale Pop Culture 3 of 5",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifnhq5d5jz4e66b3253qkec2g7bqrxwfsumuipnbbbtrfwtxvjtda",
        "IPFS CID Image": "ipfs://bafybeihhmdoz5vk3edsrd4yw3wms5meaaxiqfevsdm7i56b7kpubeeg43q",
        "Token ID": "33c0e78235830a6bf7b785d9d69921fc48f2f3ff7d6da8f44ae79ac6c2833768"
    },
    {
        "NFT_Type": "Slash",
        "Song to pair": "Sweet child",
        "File Name": "Character NFT MISC Slash V2.jpg",
        "NFT Name/Title": "Slash",
        "Description": "Greasy Royale Pop Culture 4 of 5",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeic4bd5bxawawpzsbncykszy2hrt6zm2fx3lhn7nlvlh4ztuwi6xhe",
        "IPFS CID Image": "ipfs://bafybeih3i54fb7h6frkbvbk2t25yqbcunyjax3batdrcrdzely536csb54",
        "Token ID": "fe7b35b7d996b936fb4afb0613c2b706ef0bbd3f489f5a37401a25472d8293ec"
    },
    {
        "NFT_Type": "Michael Jordan",
        "Song to pair": "Sirius Chicago Bulls",
        "File Name": "Character NFT MISC Michael Jordan V2.jpg",
        "NFT Name/Title": "Michael Jordan",
        "Description": "Greasy Royale Pop Culture 5 of 5",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeife7js7jmmgv6k2jsbaapn23kd2qfjt5jf7ezubzddxsja6twwngu",
        "IPFS CID Image": "ipfs://bafybeidj4eegmpeviuc7mtzskuroajsjs6gru23x6geklqqpymldt42jxm",
        "Token ID": "bf868fd1d2a35dfc5ed1e53ac505777168f0b30deb0c87e026a9e6f58403dc8b"
    },
    {
        "NFT_Type": "Kevin McCallister",
        "Token ID": "a3a73755862a0227484e04f0c06736c9bfc18ab393f30223bca46bf9a2fa9af3",
        "Song to pair": "Home Along Theme",
        "File Name": "Character NFT Home Alone Kevin McCallister V2.jpg",
        "NFT Name/Title": "Kevin McCallister",
        "Description": "Greasy Royale Home Alone 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeif4earytxoyiwhd6mxerih4p22t6mdu2o44bjflw7teptkqsamtwq",
        "IPFS CID Image": "ipfs://bafybeie665ui4ikd73ezldaayp2i6av7ywdfiswxuw2feewcoq3l5yxhbu"
    },
    {
        "NFT_Type": "Harry",
        "Token ID": "ea6399d67def0d180ca0bd12a065a6d372b33c2dde906baaeb2ab09d457230a0",
        "Song to pair": "Home Along Theme",
        "File Name": "Character NFT Home Alone HArry V2.jpg",
        "NFT Name/Title": "Harry",
        "Description": "Greasy Royale Home Alone 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeif4earytxoyiwhd6mxerih4p22t6mdu2o44bjflw7teptkqsamtwq",
        "IPFS CID Image": "ipfs://bafybeidfcmh7a5o5lhwyb74g3okhpk47vcwnjus3mgmsuxdl2whippmdka"
    },
    {
        "NFT_Type": "Marv",
        "Token ID": "486cf8e900dd8005700ec8fa894ced4c7905ad06836ec66405d498bd1c19a161",
        "Song to pair": "Home Along Theme",
        "File Name": "Character NFT Home Alone Marv V2.jpg",
        "NFT Name/Title": "Marv",
        "Description": "Greasy Royale Home Alone 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeif4earytxoyiwhd6mxerih4p22t6mdu2o44bjflw7teptkqsamtwq",
        "IPFS CID Image": "ipfs://bafybeie5w7u4arzroppw5gqc2uwwcktx7ajrapr3do7oa6ezqrm253erui"
    },
    {
        "NFT_Type": "T1000",
        "Song to pair": " Terminator Theme ",
        "File Name": "Character NFT Terminator T1000 V2.jpg",
        "NFT Name/Title": "T1000",
        "Description": "Greasy Royale Terminator 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihdaiffde5kzqvyfv7rohxqqdhzstklsjkoyn6we752ip6znbjble",
        "IPFS CID Image": "ipfs://bafybeid3q2eaxhi7zywhpvuiwe2n5orqm2ms23twnph65utl2sqb4o3mb4",
        "Token ID": "edf8d4f830359c69c98088c89fc1475244d3a4d922bd037caa1bfd1ccbd50319"
    },
    {
        "NFT_Type": "Terminator",
        "Song to pair": " Terminator Theme ",
        "File Name": "Character NFT Terminator Terminator V2.jpg",
        "NFT Name/Title": "Terminator",
        "Description": "Greasy Royale Terminator 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihdaiffde5kzqvyfv7rohxqqdhzstklsjkoyn6we752ip6znbjble",
        "IPFS CID Image": "ipfs://bafybeiakbmg4uhgaazpdc5cdrkalvkmrk44zhpzvbzlx3jmszzqfkkxob4",
        "Token ID": "8debc15947bb753526b45aa5a70404be28d1c490999f862c3dc05fcfae5445da"
    },
    {
        "NFT_Type": "John Connor",
        "Song to pair": " Terminator Theme ",
        "File Name": "Character NFT Terminator John Connor V2.jpg",
        "NFT Name/Title": "John Connor",
        "Description": "Greasy Royale Terminator 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihdaiffde5kzqvyfv7rohxqqdhzstklsjkoyn6we752ip6znbjble",
        "IPFS CID Image": "ipfs://bafybeidjkjgbrm2k4bfeutaqz66rumcymui6ewjzctq423tq4xg54z4ube",
        "Token ID": "b74afe951518bf6be0daceb50cd263abb070c1e1b60876f76e77428020d7e0a2"
    },
    {
        "NFT_Type": "Teen Wolf",
        "Song to pair": "Surfin USA",
        "File Name": "Character NFT Teen Wolf Scott Howard V2.jpg",
        "NFT Name/Title": "Teen Wolf",
        "Description": "Greasy Royale Teen Wolf 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihea3ojrlznpdspguqfvrag6iwcha4ymhh3ud2e3dvhvpnsu22gwu",
        "IPFS CID Image": "ipfs://bafybeidc2cw7nseoow4yy2tcdrgm7x75rb246t45ymbrqmdjsucy4gyury",
        "Token ID": "c6066d95c6645347927a0abcd899be6c4f66d164f75861a3da17b08f7d438902"
    },
    {
        "NFT_Type": "Stiles",
        "Song to pair": "Surfin USA",
        "File Name": "Character NFT Teen Wolf Stiles V2.jpg",
        "NFT Name/Title": "Stiles",
        "Description": "Greasy Royale Teen Wolf 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihea3ojrlznpdspguqfvrag6iwcha4ymhh3ud2e3dvhvpnsu22gwu",
        "IPFS CID Image": "ipfs://bafybeibh3mb65nctzb3ubfmlf35kcxjw3yskrvp725b33mekvy67ctm6v4",
        "Token ID": "ab900db573e7d3b622c36e15359386dfd87000af956a0b7c0de9978ec5d3aa63"
    },
    {
        "NFT_Type": "Boof",
        "Song to pair": "Surfin USA",
        "File Name": "Character NFT Teen Wolf Boof V2.jpg",
        "NFT Name/Title": "Boof",
        "Description": "Greasy Royale Teen Wolf 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihea3ojrlznpdspguqfvrag6iwcha4ymhh3ud2e3dvhvpnsu22gwu",
        "IPFS CID Image": "ipfs://bafybeibliqofqufy2kngwm4mtfw5bzzn5onc7toqilc3yth5d52pzniu5a",
        "Token ID": "d384d79a53c6dc9025c5ede244107bb549f70c3933c698baa2f42424ecac4098"
    },
    {
        "NFT_Type": "Wayne",
        "Song to pair": "Bohemian Rhapsody",
        "File Name": "Character NFT Wayne's World Wayne V2.jpg",
        "NFT Name/Title": "Wayne",
        "Description": "Greasy Royale Wayne's World 1of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeig5e4rz23yxirrw5uuf3bkluivuu5h6kzixq3m4gsujicof4wehcu",
        "IPFS CID Image": "ipfs://bafybeibfi7r2kpcbe7hmj3c7ujbcx7rbh4dogb2eui73gz3upta4hbbrim",
        "Token ID": "26141efac7ed308947279a72fa933768d5f47e74556945f83e528047b80a486e"
    },
    {
        "NFT_Type": "Garth",
        "Song to pair": "Bohemian Rhapsody",
        "File Name": "Character NFT Wayne's World Garth V2.jpg",
        "NFT Name/Title": "Garth",
        "Description": "Greasy Royale Wayne's World 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeig5e4rz23yxirrw5uuf3bkluivuu5h6kzixq3m4gsujicof4wehcu",
        "IPFS CID Image": "ipfs://bafybeigcbvhj6rsj3hlevihpkhygoyz5ppofxu5kmsfxwdrsvnxe5qmilu",
        "Token ID": "fa8e421472c04c4ed4eff4b167756c8f13510bc20e760ce43e3a01261af74db5"
    },
    {
        "NFT_Type": "Cassandra",
        "Song to pair": "Bohemian Rhapsody",
        "File Name": "Character NFT Wayne's World Cassandra V2.jpg",
        "NFT Name/Title": "Cassandra",
        "Description": "Greasy Royale Wayne's World 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeig5e4rz23yxirrw5uuf3bkluivuu5h6kzixq3m4gsujicof4wehcu",
        "IPFS CID Image": "ipfs://bafybeiegaty7auffvd3nzl3japefuaumpuuwnn5xehmb675ubnbn4ycuea",
        "Token ID": "d08f3bd04f22b5dbf932c54054a32b4de3ba150da9e9658d65c10d95677f638f"
    },
    {
        "NFT_Type": "Doc ",
        "Song to pair": "Back to the future theme",
        "File Name": "Character NFT Back 2 The Future Doc V2.jpg",
        "NFT Name/Title": "Doc ",
        "Description": "Greasy Royale Back to the Future 2 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid27bk5nnwzqmckjrmuqhfa4amuadtygsh7stfzbxtdoekcyircve",
        "IPFS CID Image": "ipfs://bafybeidrizfcivyjnerqhdxi2c22wh3exycckxemxt2z3gf6qhizyblxtm"
    },
    {
        "NFT_Type": "Marty",
        "Song to pair": "Back to the future theme",
        "File Name": "Character NFT Back 2 The Future Marty V2.jpg",
        "NFT Name/Title": "Marty",
        "Description": "Greasy Royale Back to the Future 1 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid27bk5nnwzqmckjrmuqhfa4amuadtygsh7stfzbxtdoekcyircve",
        "IPFS CID Image": "ipfs://bafybeibls72kekksgep23vaqgydisfjznjmvyhozwcsk6umo5mmj5aupmq",
        "Token ID": "4fe66a6c59ee415184b18c27830e5ee02fd50c2ae5394fceaf03a897e678010c"
    },
    {
        "NFT_Type": "Biff Tannen",
        "Song to pair": "Back to the future theme",
        "File Name": "Character NFT Back 2 The Future Biff V2.jpg",
        "NFT Name/Title": "Biff Tannen",
        "Description": "Greasy Royale Back to the Future 3 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid27bk5nnwzqmckjrmuqhfa4amuadtygsh7stfzbxtdoekcyircve",
        "IPFS CID Image": "ipfs://bafybeiedyz3f4wdwtdu327uqkckpagpdsztfat7pc5vouigqf4njcygdbq",
        "Token ID": "e35b9a7104000a3fd832ea3b867650ee74d5eee0bf65e98297af17a264f0b5e5"
    },
    {
        "NFT_Type": "Lorraine",
        "Song to pair": "Back to the future theme",
        "File Name": "Character NFT Back 2 The Future Jennifer V2",
        "NFT Name/Title": "Jennifer",
        "Description": "Greasy Royale Back to the Future 4 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeid27bk5nnwzqmckjrmuqhfa4amuadtygsh7stfzbxtdoekcyircve",
        "IPFS CID Image": "ipfs://bafybeifxr5lmhfzdeyqckcitu3g6wjc77xxa2d3uo3moifczygzyjetwre",
        "Token ID": "d46c33fc07721e11bbdfd25c54ee0032482bea0ff93d99ca3c3d2ac84f88c163"
    },
    {
        "NFT_Type": "Hulk Hogan",
        "Song to pair": " Real American  ",
        "File Name": "Character NFT WWE Hulk Hogan V2.jpg",
        "NFT Name/Title": "Hulk Hogan",
        "Description": "Greasy Royale WWE 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeic7madrb7nach5czjtno22qr772kbz2prtmtt57w5gu7csdnf7qqe",
        "IPFS CID Image": "ipfs://bafybeihjshgylqvjwnhjz7guhwukkmbwq23z7rs7u6a2rs3x4p3fhz6364",
        "Token ID": "7b64a1fc44d46a224b8794f349dbc81068e625ce33b68603a5274b347c9b4410"
    },
    {
        "NFT_Type": "Randy Savage",
        "Song to pair": " Pomp and Curcumstance ",
        "File Name": "Character NFT WWE Randy Savage V2.jpg",
        "NFT Name/Title": "Randy Savage",
        "Description": "Greasy Royale WWE 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeibnqg7ncwl4mzquhjontbegczdsqlyfcvupxuap5o3mhj6vxdchzi",
        "IPFS CID Image": "ipfs://bafybeifzpsgl64fe4wjg3jzivjanksgnncpuswmjc6hbgb64zcdaup5ugy",
        "Token ID": "eba02bf4efec95e86020c4e1bf59f500ea3aaf9c180fd81f5b68d42567ca535f"
    },
    {
        "NFT_Type": "The Ultimate Warrior",
        "Song to pair": "Ultimate warrior theme song",
        "File Name": "Character NFT WWE The Ultimate Warrior V2.jpg",
        "NFT Name/Title": "The Ultimate Warrior",
        "Description": "Greasy Royale WWE 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeigiy6edywzuoj3knv27uozel2sipqaunfi3ubnxhcvhbhb3ktnmm4",
        "IPFS CID Image": "ipfs://bafybeigebvlk4djhvfmq5n6cjhu4f7ogalnoeps7a7e2jdxsffwdhrla6e",
        "Token ID": "6df9d64eeb2b1a3ef7dee90d66262cedce356dde20681133f49854f7ee0ece50"
    },
    {
        "NFT_Type": "Maverick",
        "Song to pair": " Top Gun Theme Song ",
        "File Name": "Character NFT Top Gun Maverick V2.jpg",
        "NFT Name/Title": "Maverick",
        "Description": "Greasy Royale Top Gun 1 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidb2hejriqfxxj6fhwtcyiwap3n4xqkd47jdqjksvl6e53aygette",
        "IPFS CID Image": "ipfs://bafybeickj2fgtkoenfglnryqa4ybiufb46cssrqkvtfwraoqfja2ujg55i",
        "Token ID": "1c54e101ee72ad1c2ac9d4fd092f54e0bd111062cabc40499f68f66e6d242aa4"
    },
    {
        "NFT_Type": "Goose",
        "Song to pair": " Top Gun Theme Song ",
        "File Name": "Character NFT Top Gun Goose V2.jpg",
        "NFT Name/Title": "Goose",
        "Description": "Greasy Royale Top Gun 2 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidb2hejriqfxxj6fhwtcyiwap3n4xqkd47jdqjksvl6e53aygette",
        "IPFS CID Image": "ipfs://bafybeie33ysylvzcsoo3q3xcsu2g5lzqvxy6pcqz6acxs5se2mu4fl6nhi",
        "Token ID": "abe41d98ea178d588fc74b04c11f2223c8d198c052c2b1f273419b4666676cac"
    },
    {
        "NFT_Type": "Ice Man",
        "Song to pair": " Top Gun Theme Song ",
        "File Name": "Character NFT Top Gun Ice Man V2.jpg",
        "NFT Name/Title": "Ice Man",
        "Description": "Greasy Royale Top Gun 3 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidb2hejriqfxxj6fhwtcyiwap3n4xqkd47jdqjksvl6e53aygette",
        "IPFS CID Image": "ipfs://bafybeigsqqukaw6io6a2ulwmcuegvem5lkuaobely76fvtlom5n5bajuqq",
        "Token ID": "cb73ae381531a8649328c767421744c417c490690e87737caa69a31ea9515932"
    },
    {
        "NFT_Type": "Charlie",
        "Song to pair": " Top Gun Theme Song ",
        "File Name": "Character NFT Top Gun Charlie V2.jpg",
        "NFT Name/Title": "Charlie",
        "Description": "Greasy Royale Top Gun 4 of 4",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidb2hejriqfxxj6fhwtcyiwap3n4xqkd47jdqjksvl6e53aygette",
        "IPFS CID Image": "ipfs://bafybeiagnzqeex7jomjfbo2lrlxdhdfl645kjmxpmg3j6v3rnfl44taavy",
        "Token ID": "98502c57cc831cd0253525f2cc6f3780e1c0b046e33c2c48c4b067b1e0f9027e"
    },
    {
        "NFT_Type": "Indiana",
        "Song to pair": "Indiana Jones Theme Song",
        "File Name": "Character NFT Indiana Jones Indiana V2.jpg",
        "NFT Name/Title": "Indiana",
        "Description": "Greasy Royale Indiana Jones 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidc6bw5h2xa6e4grgvlqs732mvaes4culseiwoyj2bjk7p5z6xqoe",
        "IPFS CID Image": "ipfs://bafybeibc5drzc5awvxwja6lwhjdoc2tem46s4ahzmsosxducxz7pzs6v2a",
        "Token ID": "fbe4e0bb77736eda13c6ecd88d5f1d9c1881f3db0e293adf4ecee4c61658c45e"
    },
    {
        "NFT_Type": "Marion",
        "Song to pair": "Indiana Jones Theme Song",
        "File Name": "Character NFT Indiana Jones Marion V2.jpg",
        "NFT Name/Title": "Marion",
        "Description": "Greasy Royale Indiana Jones 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidc6bw5h2xa6e4grgvlqs732mvaes4culseiwoyj2bjk7p5z6xqoe",
        "IPFS CID Image": "ipfs://bafybeifa4jrxlszw4ekfdxbbvwfdpbvgb2qdinxicmt7zfifavva4bydpm",
        "Token ID": "7204758906247a111a2cfb80691c27de890a5f9c60e1ad00d960ed70ee1b0d37"
    },
    {
        "NFT_Type": "Short Round",
        "Song to pair": "Indiana Jones Theme Song",
        "File Name": "Character NFT Indiana Jones Short Round V2.jpg",
        "NFT Name/Title": "Short Round",
        "Description": "Greasy Royale Indiana Jones 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeidc6bw5h2xa6e4grgvlqs732mvaes4culseiwoyj2bjk7p5z6xqoe",
        "IPFS CID Image": "ipfs://bafybeiemie5q26uej4v237p26druh6n7qpyc6skw532t7526ydufb7v3ry",
        "Token ID": "eed38d1723f5b3df4770487aa5e9c3b44ebdbe962e0d2311ad458ce267af1ef8"
    },
    {
        "NFT_Type": "Eazy E",
        "Song to pair": "Nothin but a g thang",
        "File Name": "Character NFT NWA Eazy E V2",
        "NFT Name/Title": "Eazy E",
        "Description": "Greasy Royale NWA 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifsqr7gypumvtxxsjnwvbttoofreqtdudn5bdt4eh4akiygizx7lu",
        "IPFS CID Image": "ipfs://bafybeiafe2wr6fmaqutpfsfiniinjxk7kntpuog2geptuhexkszgxzd5au",
        "Token ID": "7b5c975c7180642bc42377eef1bc4691b38e504da73a3b0486a3be2896570f91"
    },
    {
        "NFT_Type": "Ice Cube",
        "Song to pair": "Nothin but a g thang",
        "File Name": "Character NFT NWA Ice Cube V2",
        "NFT Name/Title": "Ice Cube",
        "Description": "Greasy Royale NWA 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifsqr7gypumvtxxsjnwvbttoofreqtdudn5bdt4eh4akiygizx7lu",
        "IPFS CID Image": "ipfs://bafybeigjneektulpjzss5lkgw5htt3v5uh7i5q4ab35t5v5j3x3iaai54y",
        "Token ID": "e9122ca70dd2e7af0890008c3a26d275a1e0752ac4deb049af9b7315e58ac7b2"
    },
    {
        "NFT_Type": "Dr. Dre",
        "Song to pair": "Nothin but a g thang",
        "File Name": "Character NFT NWA  Dr Dre V2.jpg",
        "NFT Name/Title": "Dr. Dre",
        "Description": "Greasy Royale NWA 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeifsqr7gypumvtxxsjnwvbttoofreqtdudn5bdt4eh4akiygizx7lu",
        "IPFS CID Image": "ipfs://bafybeiee2wc6rbxokvm3dzkjxdbxsmenvc4rdaih6age2spocgdsggbgpi",
        "Token ID": "44d06e3e3798f0435311ae7376aef569a083398a4c5c9a67a75ca1dfd07aafaa"
    },
    {
        "NFT_Type": "David Hasslehoff",
        "Song to pair": "Bay Watch Theme Song",
        "File Name": "Character NFT Baywatch Mitch Buchannon V2.jpg",
        "NFT Name/Title": "Mitch Buchannon",
        "Description": "Greasy Royale Baywatch 2 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihghpq3xkoat5d34lewgztkbadrcqi3mzsd5lpkvvmtqp72b42iou",
        "IPFS CID Image": "ipfs://bafybeicp2xwegawvwenix7hdfwxe6d3eh4cfgu5ws3eeawgwawjwicjkvu",
        "Token ID": "e8adc2a7a06c9c4ca853d407f80d2651bdd0bff6593f63e071767d689bf2571d"
    },
    {
        "NFT_Type": "Pamela Anderson",
        "Song to pair": "Bay Watch Theme Song",
        "File Name": "Character NFT Baywatch Pam V2.jpg",
        "NFT Name/Title": "CJ Parker",
        "Description": "Greasy Royale Baywatch 1 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihghpq3xkoat5d34lewgztkbadrcqi3mzsd5lpkvvmtqp72b42iou",
        "IPFS CID Image": "ipfs://bafybeigpbr7hpcxj5bhgdzb53iwjc4urdg77ziy5iasa4aqw47dvl7e7xi",
        "Token ID": "916a5bd8b9c974499b65bc99dfc73d364e0cda295355954734edef36c56aab1e"
    },
    {
        "NFT_Type": "Carmen Electra",
        "Song to pair": "Bay Watch Theme Song",
        "File Name": "Character NFT Baywatch Lani Mckenzie V2.jpg",
        "NFT Name/Title": "Lani Mckenzie",
        "Description": "Greasy Royale Baywatch 3 of 3",
        "Number to mint": "1",
        "IPFS CID Audio": "ipfs://bafybeihghpq3xkoat5d34lewgztkbadrcqi3mzsd5lpkvvmtqp72b42iou",
        "IPFS CID Image": "ipfs://bafybeief3umbm5k6ldqjtehs4ctv77h6vzfcswl3vyrxoz5mhr7cr54j6y",
        "Token ID": "d64e55adb1d0041450ed4b2add00e73f5c8859a57ff052e303d973d3e249c954"
    }
];

const GreaseViewer = () => {
    const [isValidating, setValidating] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [user_tokens, setUserTokens] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
  
    useEffect(() => {
        const connectAndFetchData = async () => {
          try {
            if (await ergoConnector.nautilus.connect()) {
              // Fetch user UTXOs
              const user_utxos = await ergo.get_utxos();
      
              // Extract token IDs from assets within each UTXO
              const userTokenIds: string[] = [];
              user_utxos.forEach(utxo => {
                utxo.assets.forEach(asset => {
                  userTokenIds.push(asset.tokenId);
                });
              });
      
              // Deduplicate token IDs, if needed
              const uniqueUserTokenIds = Array.from(new Set(userTokenIds));
      
              // Set the state
              setUserTokens(uniqueUserTokenIds);
      
              // Filter grease_data based on user's tokens
              const filteredData = grease_data.filter(grease => uniqueUserTokenIds.includes(grease['Token ID']));
              setData(filteredData);
            }
          } catch (err) {
            setError(err);
          } finally {
            setValidating(false);
          }
        };
      
        connectAndFetchData();
      }, []);
  
    if (isValidating) {
      return <>Loading...</>;
    }
  
    if (error) {
      return <>{JSON.stringify(error)}</>;
    }
  
    if (data.length > 0) {
        return (
          <div className="nft-container">
            {data.map((nft, index) => (
              <div key={index} className="nft-card w-96 my-6 mx-6 bg-gray-100 rounded-lg text-black inline-block shadow-lg">
                <img src={`https://ipfs.io/ipfs/${nft['IPFS CID Image'].replace('ipfs://', '')}`} alt={nft['NFT Name/Title']} />
               <div className="p-4">
                <h3>Title: {nft['NFT Name/Title']}</h3>
                <p>Description: {nft['Description']}</p>
</div>
                <div className="audio-container">
                  <audio controls controlsList="nodownload" 
  style={{ width: '100%' }}>
                    <source src={`https://ipfs.io/ipfs/${nft['IPFS CID Audio'].replace('ipfs://', '')}`} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        );
      }
      
  
    return null;
  };
  
  export default GreaseViewer;