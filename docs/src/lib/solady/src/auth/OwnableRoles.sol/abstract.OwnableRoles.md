# OwnableRoles
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md)

**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/auth/Ownable.sol)

Simple single owner and multiroles authorization mixin.

*While the ownable portion follows [EIP-173](https://eips.ethereum.org/EIPS/eip-173)
for compatibility, the nomenclature for the 2-step ownership handover and roles
may be unique to this codebase.*


## State Variables
### _ROLES_UPDATED_EVENT_SIGNATURE
*`keccak256(bytes("RolesUpdated(address,uint256)"))`.*


```solidity
uint256 private constant _ROLES_UPDATED_EVENT_SIGNATURE =
    0x715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26;
```


### _ROLE_SLOT_SEED
*The role slot of `user` is given by:
```
mstore(0x00, or(shl(96, user), _ROLE_SLOT_SEED))
let roleSlot := keccak256(0x00, 0x20)
```
This automatically ignores the upper bits of the `user` in case
they are not clean, as well as keep the `keccak256` under 32-bytes.
Note: This is equivalent to `uint32(bytes4(keccak256("_OWNER_SLOT_NOT")))`.*


```solidity
uint256 private constant _ROLE_SLOT_SEED = 0x8b78c6d8;
```


### _ROLE_0

```solidity
uint256 internal constant _ROLE_0 = 1 << 0;
```


### _ROLE_1

```solidity
uint256 internal constant _ROLE_1 = 1 << 1;
```


### _ROLE_2

```solidity
uint256 internal constant _ROLE_2 = 1 << 2;
```


### _ROLE_3

```solidity
uint256 internal constant _ROLE_3 = 1 << 3;
```


### _ROLE_4

```solidity
uint256 internal constant _ROLE_4 = 1 << 4;
```


### _ROLE_5

```solidity
uint256 internal constant _ROLE_5 = 1 << 5;
```


### _ROLE_6

```solidity
uint256 internal constant _ROLE_6 = 1 << 6;
```


### _ROLE_7

```solidity
uint256 internal constant _ROLE_7 = 1 << 7;
```


### _ROLE_8

```solidity
uint256 internal constant _ROLE_8 = 1 << 8;
```


### _ROLE_9

```solidity
uint256 internal constant _ROLE_9 = 1 << 9;
```


### _ROLE_10

```solidity
uint256 internal constant _ROLE_10 = 1 << 10;
```


### _ROLE_11

```solidity
uint256 internal constant _ROLE_11 = 1 << 11;
```


### _ROLE_12

```solidity
uint256 internal constant _ROLE_12 = 1 << 12;
```


### _ROLE_13

```solidity
uint256 internal constant _ROLE_13 = 1 << 13;
```


### _ROLE_14

```solidity
uint256 internal constant _ROLE_14 = 1 << 14;
```


### _ROLE_15

```solidity
uint256 internal constant _ROLE_15 = 1 << 15;
```


### _ROLE_16

```solidity
uint256 internal constant _ROLE_16 = 1 << 16;
```


### _ROLE_17

```solidity
uint256 internal constant _ROLE_17 = 1 << 17;
```


### _ROLE_18

```solidity
uint256 internal constant _ROLE_18 = 1 << 18;
```


### _ROLE_19

```solidity
uint256 internal constant _ROLE_19 = 1 << 19;
```


### _ROLE_20

```solidity
uint256 internal constant _ROLE_20 = 1 << 20;
```


### _ROLE_21

```solidity
uint256 internal constant _ROLE_21 = 1 << 21;
```


### _ROLE_22

```solidity
uint256 internal constant _ROLE_22 = 1 << 22;
```


### _ROLE_23

```solidity
uint256 internal constant _ROLE_23 = 1 << 23;
```


### _ROLE_24

```solidity
uint256 internal constant _ROLE_24 = 1 << 24;
```


### _ROLE_25

```solidity
uint256 internal constant _ROLE_25 = 1 << 25;
```


### _ROLE_26

```solidity
uint256 internal constant _ROLE_26 = 1 << 26;
```


### _ROLE_27

```solidity
uint256 internal constant _ROLE_27 = 1 << 27;
```


### _ROLE_28

```solidity
uint256 internal constant _ROLE_28 = 1 << 28;
```


### _ROLE_29

```solidity
uint256 internal constant _ROLE_29 = 1 << 29;
```


### _ROLE_30

```solidity
uint256 internal constant _ROLE_30 = 1 << 30;
```


### _ROLE_31

```solidity
uint256 internal constant _ROLE_31 = 1 << 31;
```


### _ROLE_32

```solidity
uint256 internal constant _ROLE_32 = 1 << 32;
```


### _ROLE_33

```solidity
uint256 internal constant _ROLE_33 = 1 << 33;
```


### _ROLE_34

```solidity
uint256 internal constant _ROLE_34 = 1 << 34;
```


### _ROLE_35

```solidity
uint256 internal constant _ROLE_35 = 1 << 35;
```


### _ROLE_36

```solidity
uint256 internal constant _ROLE_36 = 1 << 36;
```


### _ROLE_37

```solidity
uint256 internal constant _ROLE_37 = 1 << 37;
```


### _ROLE_38

```solidity
uint256 internal constant _ROLE_38 = 1 << 38;
```


### _ROLE_39

```solidity
uint256 internal constant _ROLE_39 = 1 << 39;
```


### _ROLE_40

```solidity
uint256 internal constant _ROLE_40 = 1 << 40;
```


### _ROLE_41

```solidity
uint256 internal constant _ROLE_41 = 1 << 41;
```


### _ROLE_42

```solidity
uint256 internal constant _ROLE_42 = 1 << 42;
```


### _ROLE_43

```solidity
uint256 internal constant _ROLE_43 = 1 << 43;
```


### _ROLE_44

```solidity
uint256 internal constant _ROLE_44 = 1 << 44;
```


### _ROLE_45

```solidity
uint256 internal constant _ROLE_45 = 1 << 45;
```


### _ROLE_46

```solidity
uint256 internal constant _ROLE_46 = 1 << 46;
```


### _ROLE_47

```solidity
uint256 internal constant _ROLE_47 = 1 << 47;
```


### _ROLE_48

```solidity
uint256 internal constant _ROLE_48 = 1 << 48;
```


### _ROLE_49

```solidity
uint256 internal constant _ROLE_49 = 1 << 49;
```


### _ROLE_50

```solidity
uint256 internal constant _ROLE_50 = 1 << 50;
```


### _ROLE_51

```solidity
uint256 internal constant _ROLE_51 = 1 << 51;
```


### _ROLE_52

```solidity
uint256 internal constant _ROLE_52 = 1 << 52;
```


### _ROLE_53

```solidity
uint256 internal constant _ROLE_53 = 1 << 53;
```


### _ROLE_54

```solidity
uint256 internal constant _ROLE_54 = 1 << 54;
```


### _ROLE_55

```solidity
uint256 internal constant _ROLE_55 = 1 << 55;
```


### _ROLE_56

```solidity
uint256 internal constant _ROLE_56 = 1 << 56;
```


### _ROLE_57

```solidity
uint256 internal constant _ROLE_57 = 1 << 57;
```


### _ROLE_58

```solidity
uint256 internal constant _ROLE_58 = 1 << 58;
```


### _ROLE_59

```solidity
uint256 internal constant _ROLE_59 = 1 << 59;
```


### _ROLE_60

```solidity
uint256 internal constant _ROLE_60 = 1 << 60;
```


### _ROLE_61

```solidity
uint256 internal constant _ROLE_61 = 1 << 61;
```


### _ROLE_62

```solidity
uint256 internal constant _ROLE_62 = 1 << 62;
```


### _ROLE_63

```solidity
uint256 internal constant _ROLE_63 = 1 << 63;
```


### _ROLE_64

```solidity
uint256 internal constant _ROLE_64 = 1 << 64;
```


### _ROLE_65

```solidity
uint256 internal constant _ROLE_65 = 1 << 65;
```


### _ROLE_66

```solidity
uint256 internal constant _ROLE_66 = 1 << 66;
```


### _ROLE_67

```solidity
uint256 internal constant _ROLE_67 = 1 << 67;
```


### _ROLE_68

```solidity
uint256 internal constant _ROLE_68 = 1 << 68;
```


### _ROLE_69

```solidity
uint256 internal constant _ROLE_69 = 1 << 69;
```


### _ROLE_70

```solidity
uint256 internal constant _ROLE_70 = 1 << 70;
```


### _ROLE_71

```solidity
uint256 internal constant _ROLE_71 = 1 << 71;
```


### _ROLE_72

```solidity
uint256 internal constant _ROLE_72 = 1 << 72;
```


### _ROLE_73

```solidity
uint256 internal constant _ROLE_73 = 1 << 73;
```


### _ROLE_74

```solidity
uint256 internal constant _ROLE_74 = 1 << 74;
```


### _ROLE_75

```solidity
uint256 internal constant _ROLE_75 = 1 << 75;
```


### _ROLE_76

```solidity
uint256 internal constant _ROLE_76 = 1 << 76;
```


### _ROLE_77

```solidity
uint256 internal constant _ROLE_77 = 1 << 77;
```


### _ROLE_78

```solidity
uint256 internal constant _ROLE_78 = 1 << 78;
```


### _ROLE_79

```solidity
uint256 internal constant _ROLE_79 = 1 << 79;
```


### _ROLE_80

```solidity
uint256 internal constant _ROLE_80 = 1 << 80;
```


### _ROLE_81

```solidity
uint256 internal constant _ROLE_81 = 1 << 81;
```


### _ROLE_82

```solidity
uint256 internal constant _ROLE_82 = 1 << 82;
```


### _ROLE_83

```solidity
uint256 internal constant _ROLE_83 = 1 << 83;
```


### _ROLE_84

```solidity
uint256 internal constant _ROLE_84 = 1 << 84;
```


### _ROLE_85

```solidity
uint256 internal constant _ROLE_85 = 1 << 85;
```


### _ROLE_86

```solidity
uint256 internal constant _ROLE_86 = 1 << 86;
```


### _ROLE_87

```solidity
uint256 internal constant _ROLE_87 = 1 << 87;
```


### _ROLE_88

```solidity
uint256 internal constant _ROLE_88 = 1 << 88;
```


### _ROLE_89

```solidity
uint256 internal constant _ROLE_89 = 1 << 89;
```


### _ROLE_90

```solidity
uint256 internal constant _ROLE_90 = 1 << 90;
```


### _ROLE_91

```solidity
uint256 internal constant _ROLE_91 = 1 << 91;
```


### _ROLE_92

```solidity
uint256 internal constant _ROLE_92 = 1 << 92;
```


### _ROLE_93

```solidity
uint256 internal constant _ROLE_93 = 1 << 93;
```


### _ROLE_94

```solidity
uint256 internal constant _ROLE_94 = 1 << 94;
```


### _ROLE_95

```solidity
uint256 internal constant _ROLE_95 = 1 << 95;
```


### _ROLE_96

```solidity
uint256 internal constant _ROLE_96 = 1 << 96;
```


### _ROLE_97

```solidity
uint256 internal constant _ROLE_97 = 1 << 97;
```


### _ROLE_98

```solidity
uint256 internal constant _ROLE_98 = 1 << 98;
```


### _ROLE_99

```solidity
uint256 internal constant _ROLE_99 = 1 << 99;
```


### _ROLE_100

```solidity
uint256 internal constant _ROLE_100 = 1 << 100;
```


### _ROLE_101

```solidity
uint256 internal constant _ROLE_101 = 1 << 101;
```


### _ROLE_102

```solidity
uint256 internal constant _ROLE_102 = 1 << 102;
```


### _ROLE_103

```solidity
uint256 internal constant _ROLE_103 = 1 << 103;
```


### _ROLE_104

```solidity
uint256 internal constant _ROLE_104 = 1 << 104;
```


### _ROLE_105

```solidity
uint256 internal constant _ROLE_105 = 1 << 105;
```


### _ROLE_106

```solidity
uint256 internal constant _ROLE_106 = 1 << 106;
```


### _ROLE_107

```solidity
uint256 internal constant _ROLE_107 = 1 << 107;
```


### _ROLE_108

```solidity
uint256 internal constant _ROLE_108 = 1 << 108;
```


### _ROLE_109

```solidity
uint256 internal constant _ROLE_109 = 1 << 109;
```


### _ROLE_110

```solidity
uint256 internal constant _ROLE_110 = 1 << 110;
```


### _ROLE_111

```solidity
uint256 internal constant _ROLE_111 = 1 << 111;
```


### _ROLE_112

```solidity
uint256 internal constant _ROLE_112 = 1 << 112;
```


### _ROLE_113

```solidity
uint256 internal constant _ROLE_113 = 1 << 113;
```


### _ROLE_114

```solidity
uint256 internal constant _ROLE_114 = 1 << 114;
```


### _ROLE_115

```solidity
uint256 internal constant _ROLE_115 = 1 << 115;
```


### _ROLE_116

```solidity
uint256 internal constant _ROLE_116 = 1 << 116;
```


### _ROLE_117

```solidity
uint256 internal constant _ROLE_117 = 1 << 117;
```


### _ROLE_118

```solidity
uint256 internal constant _ROLE_118 = 1 << 118;
```


### _ROLE_119

```solidity
uint256 internal constant _ROLE_119 = 1 << 119;
```


### _ROLE_120

```solidity
uint256 internal constant _ROLE_120 = 1 << 120;
```


### _ROLE_121

```solidity
uint256 internal constant _ROLE_121 = 1 << 121;
```


### _ROLE_122

```solidity
uint256 internal constant _ROLE_122 = 1 << 122;
```


### _ROLE_123

```solidity
uint256 internal constant _ROLE_123 = 1 << 123;
```


### _ROLE_124

```solidity
uint256 internal constant _ROLE_124 = 1 << 124;
```


### _ROLE_125

```solidity
uint256 internal constant _ROLE_125 = 1 << 125;
```


### _ROLE_126

```solidity
uint256 internal constant _ROLE_126 = 1 << 126;
```


### _ROLE_127

```solidity
uint256 internal constant _ROLE_127 = 1 << 127;
```


### _ROLE_128

```solidity
uint256 internal constant _ROLE_128 = 1 << 128;
```


### _ROLE_129

```solidity
uint256 internal constant _ROLE_129 = 1 << 129;
```


### _ROLE_130

```solidity
uint256 internal constant _ROLE_130 = 1 << 130;
```


### _ROLE_131

```solidity
uint256 internal constant _ROLE_131 = 1 << 131;
```


### _ROLE_132

```solidity
uint256 internal constant _ROLE_132 = 1 << 132;
```


### _ROLE_133

```solidity
uint256 internal constant _ROLE_133 = 1 << 133;
```


### _ROLE_134

```solidity
uint256 internal constant _ROLE_134 = 1 << 134;
```


### _ROLE_135

```solidity
uint256 internal constant _ROLE_135 = 1 << 135;
```


### _ROLE_136

```solidity
uint256 internal constant _ROLE_136 = 1 << 136;
```


### _ROLE_137

```solidity
uint256 internal constant _ROLE_137 = 1 << 137;
```


### _ROLE_138

```solidity
uint256 internal constant _ROLE_138 = 1 << 138;
```


### _ROLE_139

```solidity
uint256 internal constant _ROLE_139 = 1 << 139;
```


### _ROLE_140

```solidity
uint256 internal constant _ROLE_140 = 1 << 140;
```


### _ROLE_141

```solidity
uint256 internal constant _ROLE_141 = 1 << 141;
```


### _ROLE_142

```solidity
uint256 internal constant _ROLE_142 = 1 << 142;
```


### _ROLE_143

```solidity
uint256 internal constant _ROLE_143 = 1 << 143;
```


### _ROLE_144

```solidity
uint256 internal constant _ROLE_144 = 1 << 144;
```


### _ROLE_145

```solidity
uint256 internal constant _ROLE_145 = 1 << 145;
```


### _ROLE_146

```solidity
uint256 internal constant _ROLE_146 = 1 << 146;
```


### _ROLE_147

```solidity
uint256 internal constant _ROLE_147 = 1 << 147;
```


### _ROLE_148

```solidity
uint256 internal constant _ROLE_148 = 1 << 148;
```


### _ROLE_149

```solidity
uint256 internal constant _ROLE_149 = 1 << 149;
```


### _ROLE_150

```solidity
uint256 internal constant _ROLE_150 = 1 << 150;
```


### _ROLE_151

```solidity
uint256 internal constant _ROLE_151 = 1 << 151;
```


### _ROLE_152

```solidity
uint256 internal constant _ROLE_152 = 1 << 152;
```


### _ROLE_153

```solidity
uint256 internal constant _ROLE_153 = 1 << 153;
```


### _ROLE_154

```solidity
uint256 internal constant _ROLE_154 = 1 << 154;
```


### _ROLE_155

```solidity
uint256 internal constant _ROLE_155 = 1 << 155;
```


### _ROLE_156

```solidity
uint256 internal constant _ROLE_156 = 1 << 156;
```


### _ROLE_157

```solidity
uint256 internal constant _ROLE_157 = 1 << 157;
```


### _ROLE_158

```solidity
uint256 internal constant _ROLE_158 = 1 << 158;
```


### _ROLE_159

```solidity
uint256 internal constant _ROLE_159 = 1 << 159;
```


### _ROLE_160

```solidity
uint256 internal constant _ROLE_160 = 1 << 160;
```


### _ROLE_161

```solidity
uint256 internal constant _ROLE_161 = 1 << 161;
```


### _ROLE_162

```solidity
uint256 internal constant _ROLE_162 = 1 << 162;
```


### _ROLE_163

```solidity
uint256 internal constant _ROLE_163 = 1 << 163;
```


### _ROLE_164

```solidity
uint256 internal constant _ROLE_164 = 1 << 164;
```


### _ROLE_165

```solidity
uint256 internal constant _ROLE_165 = 1 << 165;
```


### _ROLE_166

```solidity
uint256 internal constant _ROLE_166 = 1 << 166;
```


### _ROLE_167

```solidity
uint256 internal constant _ROLE_167 = 1 << 167;
```


### _ROLE_168

```solidity
uint256 internal constant _ROLE_168 = 1 << 168;
```


### _ROLE_169

```solidity
uint256 internal constant _ROLE_169 = 1 << 169;
```


### _ROLE_170

```solidity
uint256 internal constant _ROLE_170 = 1 << 170;
```


### _ROLE_171

```solidity
uint256 internal constant _ROLE_171 = 1 << 171;
```


### _ROLE_172

```solidity
uint256 internal constant _ROLE_172 = 1 << 172;
```


### _ROLE_173

```solidity
uint256 internal constant _ROLE_173 = 1 << 173;
```


### _ROLE_174

```solidity
uint256 internal constant _ROLE_174 = 1 << 174;
```


### _ROLE_175

```solidity
uint256 internal constant _ROLE_175 = 1 << 175;
```


### _ROLE_176

```solidity
uint256 internal constant _ROLE_176 = 1 << 176;
```


### _ROLE_177

```solidity
uint256 internal constant _ROLE_177 = 1 << 177;
```


### _ROLE_178

```solidity
uint256 internal constant _ROLE_178 = 1 << 178;
```


### _ROLE_179

```solidity
uint256 internal constant _ROLE_179 = 1 << 179;
```


### _ROLE_180

```solidity
uint256 internal constant _ROLE_180 = 1 << 180;
```


### _ROLE_181

```solidity
uint256 internal constant _ROLE_181 = 1 << 181;
```


### _ROLE_182

```solidity
uint256 internal constant _ROLE_182 = 1 << 182;
```


### _ROLE_183

```solidity
uint256 internal constant _ROLE_183 = 1 << 183;
```


### _ROLE_184

```solidity
uint256 internal constant _ROLE_184 = 1 << 184;
```


### _ROLE_185

```solidity
uint256 internal constant _ROLE_185 = 1 << 185;
```


### _ROLE_186

```solidity
uint256 internal constant _ROLE_186 = 1 << 186;
```


### _ROLE_187

```solidity
uint256 internal constant _ROLE_187 = 1 << 187;
```


### _ROLE_188

```solidity
uint256 internal constant _ROLE_188 = 1 << 188;
```


### _ROLE_189

```solidity
uint256 internal constant _ROLE_189 = 1 << 189;
```


### _ROLE_190

```solidity
uint256 internal constant _ROLE_190 = 1 << 190;
```


### _ROLE_191

```solidity
uint256 internal constant _ROLE_191 = 1 << 191;
```


### _ROLE_192

```solidity
uint256 internal constant _ROLE_192 = 1 << 192;
```


### _ROLE_193

```solidity
uint256 internal constant _ROLE_193 = 1 << 193;
```


### _ROLE_194

```solidity
uint256 internal constant _ROLE_194 = 1 << 194;
```


### _ROLE_195

```solidity
uint256 internal constant _ROLE_195 = 1 << 195;
```


### _ROLE_196

```solidity
uint256 internal constant _ROLE_196 = 1 << 196;
```


### _ROLE_197

```solidity
uint256 internal constant _ROLE_197 = 1 << 197;
```


### _ROLE_198

```solidity
uint256 internal constant _ROLE_198 = 1 << 198;
```


### _ROLE_199

```solidity
uint256 internal constant _ROLE_199 = 1 << 199;
```


### _ROLE_200

```solidity
uint256 internal constant _ROLE_200 = 1 << 200;
```


### _ROLE_201

```solidity
uint256 internal constant _ROLE_201 = 1 << 201;
```


### _ROLE_202

```solidity
uint256 internal constant _ROLE_202 = 1 << 202;
```


### _ROLE_203

```solidity
uint256 internal constant _ROLE_203 = 1 << 203;
```


### _ROLE_204

```solidity
uint256 internal constant _ROLE_204 = 1 << 204;
```


### _ROLE_205

```solidity
uint256 internal constant _ROLE_205 = 1 << 205;
```


### _ROLE_206

```solidity
uint256 internal constant _ROLE_206 = 1 << 206;
```


### _ROLE_207

```solidity
uint256 internal constant _ROLE_207 = 1 << 207;
```


### _ROLE_208

```solidity
uint256 internal constant _ROLE_208 = 1 << 208;
```


### _ROLE_209

```solidity
uint256 internal constant _ROLE_209 = 1 << 209;
```


### _ROLE_210

```solidity
uint256 internal constant _ROLE_210 = 1 << 210;
```


### _ROLE_211

```solidity
uint256 internal constant _ROLE_211 = 1 << 211;
```


### _ROLE_212

```solidity
uint256 internal constant _ROLE_212 = 1 << 212;
```


### _ROLE_213

```solidity
uint256 internal constant _ROLE_213 = 1 << 213;
```


### _ROLE_214

```solidity
uint256 internal constant _ROLE_214 = 1 << 214;
```


### _ROLE_215

```solidity
uint256 internal constant _ROLE_215 = 1 << 215;
```


### _ROLE_216

```solidity
uint256 internal constant _ROLE_216 = 1 << 216;
```


### _ROLE_217

```solidity
uint256 internal constant _ROLE_217 = 1 << 217;
```


### _ROLE_218

```solidity
uint256 internal constant _ROLE_218 = 1 << 218;
```


### _ROLE_219

```solidity
uint256 internal constant _ROLE_219 = 1 << 219;
```


### _ROLE_220

```solidity
uint256 internal constant _ROLE_220 = 1 << 220;
```


### _ROLE_221

```solidity
uint256 internal constant _ROLE_221 = 1 << 221;
```


### _ROLE_222

```solidity
uint256 internal constant _ROLE_222 = 1 << 222;
```


### _ROLE_223

```solidity
uint256 internal constant _ROLE_223 = 1 << 223;
```


### _ROLE_224

```solidity
uint256 internal constant _ROLE_224 = 1 << 224;
```


### _ROLE_225

```solidity
uint256 internal constant _ROLE_225 = 1 << 225;
```


### _ROLE_226

```solidity
uint256 internal constant _ROLE_226 = 1 << 226;
```


### _ROLE_227

```solidity
uint256 internal constant _ROLE_227 = 1 << 227;
```


### _ROLE_228

```solidity
uint256 internal constant _ROLE_228 = 1 << 228;
```


### _ROLE_229

```solidity
uint256 internal constant _ROLE_229 = 1 << 229;
```


### _ROLE_230

```solidity
uint256 internal constant _ROLE_230 = 1 << 230;
```


### _ROLE_231

```solidity
uint256 internal constant _ROLE_231 = 1 << 231;
```


### _ROLE_232

```solidity
uint256 internal constant _ROLE_232 = 1 << 232;
```


### _ROLE_233

```solidity
uint256 internal constant _ROLE_233 = 1 << 233;
```


### _ROLE_234

```solidity
uint256 internal constant _ROLE_234 = 1 << 234;
```


### _ROLE_235

```solidity
uint256 internal constant _ROLE_235 = 1 << 235;
```


### _ROLE_236

```solidity
uint256 internal constant _ROLE_236 = 1 << 236;
```


### _ROLE_237

```solidity
uint256 internal constant _ROLE_237 = 1 << 237;
```


### _ROLE_238

```solidity
uint256 internal constant _ROLE_238 = 1 << 238;
```


### _ROLE_239

```solidity
uint256 internal constant _ROLE_239 = 1 << 239;
```


### _ROLE_240

```solidity
uint256 internal constant _ROLE_240 = 1 << 240;
```


### _ROLE_241

```solidity
uint256 internal constant _ROLE_241 = 1 << 241;
```


### _ROLE_242

```solidity
uint256 internal constant _ROLE_242 = 1 << 242;
```


### _ROLE_243

```solidity
uint256 internal constant _ROLE_243 = 1 << 243;
```


### _ROLE_244

```solidity
uint256 internal constant _ROLE_244 = 1 << 244;
```


### _ROLE_245

```solidity
uint256 internal constant _ROLE_245 = 1 << 245;
```


### _ROLE_246

```solidity
uint256 internal constant _ROLE_246 = 1 << 246;
```


### _ROLE_247

```solidity
uint256 internal constant _ROLE_247 = 1 << 247;
```


### _ROLE_248

```solidity
uint256 internal constant _ROLE_248 = 1 << 248;
```


### _ROLE_249

```solidity
uint256 internal constant _ROLE_249 = 1 << 249;
```


### _ROLE_250

```solidity
uint256 internal constant _ROLE_250 = 1 << 250;
```


### _ROLE_251

```solidity
uint256 internal constant _ROLE_251 = 1 << 251;
```


### _ROLE_252

```solidity
uint256 internal constant _ROLE_252 = 1 << 252;
```


### _ROLE_253

```solidity
uint256 internal constant _ROLE_253 = 1 << 253;
```


### _ROLE_254

```solidity
uint256 internal constant _ROLE_254 = 1 << 254;
```


### _ROLE_255

```solidity
uint256 internal constant _ROLE_255 = 1 << 255;
```


## Functions
### _setRoles

*Overwrite the roles directly without authorization guard.*


```solidity
function _setRoles(address user, uint256 roles) internal virtual;
```

### _updateRoles

*Updates the roles directly without authorization guard.
If `on` is true, each set bit of `roles` will be turned on,
otherwise, each set bit of `roles` will be turned off.*


```solidity
function _updateRoles(address user, uint256 roles, bool on) internal virtual;
```

### _grantRoles

*Grants the roles directly without authorization guard.
Each bit of `roles` represents the role to turn on.*


```solidity
function _grantRoles(address user, uint256 roles) internal virtual;
```

### _removeRoles

*Removes the roles directly without authorization guard.
Each bit of `roles` represents the role to turn off.*


```solidity
function _removeRoles(address user, uint256 roles) internal virtual;
```

### _checkRoles

*Throws if the sender does not have any of the `roles`.*


```solidity
function _checkRoles(uint256 roles) internal view virtual;
```

### _checkOwnerOrRoles

*Throws if the sender is not the owner,
and does not have any of the `roles`.
Checks for ownership first, then lazily checks for roles.*


```solidity
function _checkOwnerOrRoles(uint256 roles) internal view virtual;
```

### _checkRolesOrOwner

*Throws if the sender does not have any of the `roles`,
and is not the owner.
Checks for roles first, then lazily checks for ownership.*


```solidity
function _checkRolesOrOwner(uint256 roles) internal view virtual;
```

### _rolesFromOrdinals

*Convenience function to return a `roles` bitmap from an array of `ordinals`.
This is meant for frontends like Etherscan, and is therefore not fully optimized.
Not recommended to be called on-chain.
Made internal to conserve bytecode. Wrap it in a public function if needed.*


```solidity
function _rolesFromOrdinals(uint8[] memory ordinals) internal pure returns (uint256 roles);
```

### _ordinalsFromRoles

*Convenience function to return an array of `ordinals` from the `roles` bitmap.
This is meant for frontends like Etherscan, and is therefore not fully optimized.
Not recommended to be called on-chain.
Made internal to conserve bytecode. Wrap it in a public function if needed.*


```solidity
function _ordinalsFromRoles(uint256 roles) internal pure returns (uint8[] memory ordinals);
```

### grantRoles

*Allows the owner to grant `user` `roles`.
If the `user` already has a role, then it will be an no-op for the role.*


```solidity
function grantRoles(address user, uint256 roles) public payable virtual onlyOwner;
```

### revokeRoles

*Allows the owner to remove `user` `roles`.
If the `user` does not have a role, then it will be an no-op for the role.*


```solidity
function revokeRoles(address user, uint256 roles) public payable virtual onlyOwner;
```

### renounceRoles

*Allow the caller to remove their own roles.
If the caller does not have a role, then it will be an no-op for the role.*


```solidity
function renounceRoles(uint256 roles) public payable virtual;
```

### rolesOf

*Returns the roles of `user`.*


```solidity
function rolesOf(address user) public view virtual returns (uint256 roles);
```

### hasAnyRole

*Returns whether `user` has any of `roles`.*


```solidity
function hasAnyRole(address user, uint256 roles) public view virtual returns (bool);
```

### hasAllRoles

*Returns whether `user` has all of `roles`.*


```solidity
function hasAllRoles(address user, uint256 roles) public view virtual returns (bool);
```

### onlyRoles

*Marks a function as only callable by an account with `roles`.*


```solidity
modifier onlyRoles(uint256 roles) virtual;
```

### onlyOwnerOrRoles

*Marks a function as only callable by the owner or by an account
with `roles`. Checks for ownership first, then lazily checks for roles.*


```solidity
modifier onlyOwnerOrRoles(uint256 roles) virtual;
```

### onlyRolesOrOwner

*Marks a function as only callable by an account with `roles`
or the owner. Checks for roles first, then lazily checks for ownership.*


```solidity
modifier onlyRolesOrOwner(uint256 roles) virtual;
```

## Events
### RolesUpdated
*The `user`'s roles is updated to `roles`.
Each bit of `roles` represents whether the role is set.*


```solidity
event RolesUpdated(address indexed user, uint256 indexed roles);
```

