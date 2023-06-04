// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

contract ERC2309Test is ERC721A {
    string baseURI = "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/";

    constructor() ERC721A("ERC2309Test", "ERC2309TT") {
        _mintERC2309(msg.sender, 5000);
    }

    function mintERC2309(address _to, uint256 _quantity) external {
        _mintERC2309(_to, _quantity);
    }

    function mint(address _to, uint256 _quantity) external {
        _safeMint(_to, _quantity);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
