import { CommandConstant } from "./constants/CommandConstants";
import { UniversalConstant } from "./constants/UniversalConstants";
import { ChargeStart } from "./models/ChargeStart";
import { Log } from "./utils/Log";

export class CommandHandler {
    public static changeTime(time: number, isToUTC: boolean): number {
        return time;
    }

    public static chargeStart(str: string, str2: string, chargeStart: ChargeStart): Uint8Array {
        const buffer = new Uint8Array(47);
        buffer[0] = chargeStart.lineId;
        const userID = ByteUtil.userID();
        let offset = 1;
        const userIDBytes = ByteUtil.userIDByte();
        buffer.set(userIDBytes, offset);
        offset += userIDBytes.length;
        const chargeIdBytes = new TextEncoder().encode(chargeStart.chargeId);
        buffer.set(chargeIdBytes, offset);
        offset += chargeIdBytes.length;
        buffer[offset] = chargeStart.isReservation;
        offset += 1;
        const date = new Date();
        const reservationDate = this.changeTime(chargeStart.reservationDate, true);
        date.setTime(reservationDate * 1000);
        const timezoneDate = TimeZoneUtil.convertTimezone(date, TimeZone.getTimeZone("Asia/Shanghai"), TimeZone.getDefault());
        const timestamp = Math.floor(timezoneDate.getTime() / 1000);
        const timestampBytes = ByteUtil.intToBytes(timestamp);
        buffer.set(timestampBytes, offset);
        offset += timestampBytes.length;
        buffer[offset] = chargeStart.startType;
        offset += 1;
        buffer[offset] = chargeStart.chargeType;
        offset += 1;
        buffer[offset] = chargeStart.param1 >> 8;
        buffer[offset + 1] = chargeStart.param1 % 256;
        offset += 2;
        buffer[offset] = chargeStart.param2 >> 8;
        buffer[offset + 1] = chargeStart.param2 % 256;
        offset += 2;
        buffer[offset] = chargeStart.param3 >> 8;
        buffer[offset + 1] = chargeStart.param3 % 256;
        offset += 2;
        buffer[offset] = chargeStart.maxElectricity;

        const dataLength = buffer.length;
        const logMessage = `启动充电=========>>>>>>>>数据长度 ${dataLength} 用户id：${userID} 订单id：${chargeStart.chargeId}`;
        Log.d(logMessage);

        return this.packageData(str, str2, 32775, buffer);
    }

    public static getVersion(str: string, str2: string): Uint8Array {
        return this.packageData(str, str2, CommandConstant.s_getVersion, undefined);
    }

    public static packageData(str: string, str2: string, i: number, bArr?: Uint8Array): Uint8Array {
        const length = bArr ? 25 + bArr.length : 25;
        const buffer = new Uint8Array(length);
        const headerBytes = new TextEncoder().encode(UniversalConstant.PACKET_HEADER);
        buffer.set(headerBytes, 0);
        buffer[headerBytes.length] = length >> 8;
        buffer[headerBytes.length + 1] = length % 256;
        buffer[headerBytes.length + 2] = 0;
        const strBytes = new TextEncoder().encode(str);
        buffer.set(strBytes, headerBytes.length + 3);
        const str2Bytes = new TextEncoder().encode(str2);
        buffer.set(str2Bytes, headerBytes.length + 3 + strBytes.length);
        buffer[headerBytes.length + 3 + strBytes.length + str2Bytes.length] = i >> 8;
        buffer[headerBytes.length + 3 + strBytes.length + str2Bytes.length + 1] = i % 256;
        let offset = headerBytes.length + 3 + strBytes.length + str2Bytes.length + 2;
        if (bArr && bArr.length > 0) {
            buffer.set(bArr, offset);
            offset += bArr.length;
        }
        let i2 = 0;
        for (let i3 = 0; i3 < length; i3++) {
            i2 += buffer[i3] & 0xFF;
        }
        const i4 = i2 % 65536;
        buffer[offset] = i4 >> 8;
        buffer[offset + 1] = i4 % 256;
        const tailBytes = new TextEncoder().encode(UniversalConstant.PACKET_TAIL);
        buffer.set(tailBytes, offset + 2);
        const array = buffer;
        const logMessage = `[ 发送指令[ 0x${i.toString(16).toUpperCase()} ], 检验码：${i4.toString(16)}, 数据包：${array.join(" ")}`;
        Log.d(logMessage);
        return array;
    }

}

