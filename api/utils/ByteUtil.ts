class ByteUtil {
    public static byteArrayToInt_Little(b: number): number {
        return b & 0xFF;
    }

    public static byteToInt(b: number): number {
        return (b & 0x7F) | (((-2147483648) & b) >>> 24);
    }

    public static intToBytes(i: number): number[] {
        return [(i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF];
    }

    public static byteArrayToInt_LittleFromArray(bArr: number[]): number {
        let i = 0;
        if (bArr.length === 1) {
            return bArr[0] & 0xFF;
        }
        for (let length = bArr.length - 1; length >= 0; length--) {
            i += (bArr[(bArr.length - 1) - length] & 0xFF) << (length * 8);
        }
        return i < 0 ? i & 255 : i;
    }

    public static userID(): string {
        return "860" + (Build.BOARD.length % 10) + (Build.BRAND.length % 10) + (Build.CPU_ABI.length % 10) + (Build.DEVICE.length % 10) + (Build.DISPLAY.length % 10) + (Build.HOST.length % 10) + (Build.ID.length % 10) + (Build.MANUFACTURER.length % 10) + (Build.MODEL.length % 10) + (Build.PRODUCT.length % 10) + (Build.TAGS.length % 10) + (Build.TYPE.length % 10) + (Build.USER.length % 10);
    }

    public static userIDByte(): number[] {
        const bytes = ByteUtil.userID().split('').map((char) => char.charCodeAt(0));
        const bArr = new Array(16);
        const length = bytes.length > 16 ? 16 : bytes.length;
        for (let i = 0; i < length; i++) {
            bArr[i] = bytes[i];
        }
        for (let length2 = bytes.length; length2 < 16; length2++) {
            bArr[length2] = 32;
        }
        return bArr;
    }

    public static deviceIDByte(str: string): number[] {
        const bytes = str.split('').map((char) => char.charCodeAt(0));
        const bArr = new Array(15);
        const length = bytes.length > 15 ? 15 : bytes.length;
        for (let i = 0; i < length; i++) {
            bArr[i] = bytes[i];
        }
        for (let length2 = bytes.length; length2 < 15; length2++) {
            bArr[length2] = 32;
        }
        return bArr;
    }

    public static bytesToInt(bArr: number[]): number {
        let byteToInt;
        let byteToInt2;
        if (bArr.length === 2) {
            byteToInt = byteToInt(bArr[0]) << 8;
            byteToInt2 = byteToInt(bArr[1]);
        } else {
            byteToInt = ((byteToInt(bArr[0]) << 24) & 255) | (byteToInt(bArr[1]) << 16) | (byteToInt(bArr[2]) << 8);
            byteToInt2 = byteToInt(bArr[3]);
        }
        return byteToInt2 | byteToInt;
    }

    public static bytesToInt_Little(bArr: number[]): number {
        return ByteUtil.byteToInt(bArr[3]) | (ByteUtil.byteToInt(bArr[0]) << 24) | (ByteUtil.byteToInt(bArr[1]) << 16) | (ByteUtil.byteToInt(bArr[2]) << 8);
    }

    public static bytesToLong_Little(bArr: number[]): number {
        return ByteUtil.bytesToInt_Little(bArr) & 4294967295;
    }

    public static byteMerger(bArr: number[], bArr2: number[]): number[] {
        const bArr3 = new Array(bArr.length + bArr2.length);
        for (let i = 0; i < bArr.length; i++) {
            bArr3[i] = bArr[i];
        }
        for (let i = 0; i < bArr2.length; i++) {
            bArr3[bArr.length + i] = bArr2[i];
        }
        return bArr3;
    }

    public static hexTobytes(str: string): number[] {
        if (str.length < 1) {
            return null;
        }
        const bArr = new Array(str.length / 2);
        let i = 0;
        let i2 = 0;
        while (i < str.length) {
            const i3 = i + 2;
            bArr[i2] = parseInt(str.substring(i, i3), 16);
            i2++;
            i = i3;
        }
        return bArr;
    }

    public static bytesToHexString(bArr: number[]): string {
        let sb = "";
        if (bArr == null || bArr.length <= 0) {
            return null;
        }
        for (let b of bArr) {
            let hexString = (b & 0xFF).toString(16);
            if (hexString.length < 2) {
                sb += "0";
            }
            sb += hexString;
        }
        return sb;
    }

    public static bytesToInt1(bArr: number[]): number {
        let i = 0;
        for (let i2 = 0; i2 < 4; i2++) {
            i = (i << 8) | (bArr[3 - i2] & 0xFF);
        }
        return i;
    }
}



