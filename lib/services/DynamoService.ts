import {
  AttributeValue,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  paginateQuery,
  paginateScan,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from 'npm:@aws-sdk/client-dynamodb@3.425';
import { marshall, unmarshall } from 'npm:@aws-sdk/util-dynamodb@3.425';
import { EmailStatus, TTL_DELTA_7_DAYS } from './dynamoShared.ts';

export interface SaveNewEmailParams {
  status: EmailStatus;
  sesMessageId: string;
  sesMessageTimestamp: string;
  sesTo: string;
  sesFrom: string;
  mimeTo: string;
  mimeFrom: string;
  mimeForwardedFrom?: string;
  subject: string;
  parsedContent: string;
  businessGroup: string;
  businessRule: string;
  mailbox: string;
  senderEmail: string;
  ttlDays?: number;
}

export class DynamoService {
  private client: DynamoDBClient;

  constructor(credentials: any, region: string) {
    const config = { credentials, region };
    this.client = new DynamoDBClient(config);
  }

  async scan(table: string) {
    const paginatorConfig = {
      client: this.client,
    };

    const params: ScanCommandInput = {
      TableName: table,
    };

    const paginator = paginateScan(paginatorConfig, params);

    const records: Record<string, AttributeValue>[] = [];
    for await (const page of paginator) {
      if (page.Items) {
        records.push(...page.Items);
      }
    }

    return records;
  }

  async queryByPk(table: string, pk: string) {
    const paginatorConfig = {
      client: this.client,
    };

    const params: QueryCommandInput = {
      TableName: table,
      'KeyConditionExpression': '#pk = :pk',
      'ExpressionAttributeNames': {
        '#pk': 'pk',
      },
      'ExpressionAttributeValues': {
        ':pk': {
          S: pk,
        },
      },
    };

    const paginator = paginateQuery(paginatorConfig, params);

    const records: Record<string, AttributeValue>[] = [];
    for await (const page of paginator) {
      if (page.Items) {
        records.push(...page.Items);
      }
    }

    return records;
  }

  async queryByContactId(table: string, contactId: string) {
    const paginatorConfig = {
      client: this.client,
    };

    const params: QueryCommandInput = {
      TableName: table,
      IndexName: 'gsi-pk-contactId-index',
      'KeyConditionExpression': '#pk = :pk and #contactId = :contactId',
      'ExpressionAttributeNames': {
        '#pk': 'pk',
        '#contactId': 'contactId',
      },
      'ExpressionAttributeValues': {
        ':pk': {
          S: 'TASK',
        },
        ':contactId': {
          S: contactId,
        },
      },
    };

    const paginator = paginateQuery(paginatorConfig, params);

    const records: Record<string, AttributeValue>[] = [];
    for await (const page of paginator) {
      if (page.Items) {
        records.push(...page.Items);
      }
    }

    return records;
  }

  async queryByTypeBusinessGroup(table: string, index: string, typeBg: string, status?: string) {
    const paginatorConfig = {
      client: this.client,
    };

    // akTypeBusinessGroup
    const params: QueryCommandInput = {
      TableName: table,
      IndexName: index,
      'KeyConditionExpression': '#akTypeBusinessGroup = :akTypeBusinessGroup' +
        (status ? ' and #status = :status' : ''),
      'ExpressionAttributeNames': {
        '#akTypeBusinessGroup': 'akTypeBusinessGroup',
        ...(status && { '#status': 'status' }),
      },
      'ExpressionAttributeValues': {
        ':akTypeBusinessGroup': {
          S: typeBg,
        },
        ...(status && { ':status': { S: status } }),
      },
    };

    const paginator = paginateQuery(paginatorConfig, params);

    const records: Record<string, AttributeValue>[] = [];
    for await (const page of paginator) {
      if (page.Items) {
        records.push(...page.Items);
      }
    }

    return records;
  }

  async deleteItem(table: string, pk: string, sk: string) {
    console.log(`Delete ${pk} ${sk} ${table}`);

    const input: DeleteItemCommandInput = {
      'Key': {
        'pk': {
          'S': pk,
        },
        'sk': {
          'S': sk,
        },
      },
      'TableName': table,
    };

    const command = new DeleteItemCommand(input);
    const response = await this.client.send(command);

    return response;
  }

  unmarshall(record: Record<string, AttributeValue>) {
    return unmarshall(record);
  }

  unmarshallArray(records: Record<string, AttributeValue>[]) {
    const items: any[] = [];
    for (const record of records) {
      items.push(unmarshall(record));
    }
    return items;
  }

  async saveNewEmail(params: SaveNewEmailParams, table: string) {
    //console.log(params);

    let ttl = Math.floor(+new Date() / 1000) + TTL_DELTA_7_DAYS; //default to 7 days
    if (params.ttlDays) {
      const delta = 60 * 60 * 24 * params.ttlDays;
      ttl = Math.floor(+new Date() / 1000) + delta;
    }

    const input: PutItemCommandInput = {
      TableName: table,
      Item: {
        pk: { S: 'EMAIL' },
        sk: { S: params.sesMessageId },
        akTypeBusinessGroupStatus: { S: `EMAIL#${params.businessGroup}#${params.status}` },
        status: { S: params.status },
        sesMessageId: { S: params.sesMessageId },
        sesMessageTimestamp: { S: params.sesMessageTimestamp },
        sesTo: { S: params.sesTo },
        sesFrom: { S: params.sesFrom },
        mimeTo: { S: params.mimeTo },
        mimeFrom: { S: params.mimeFrom },
        ...(params.mimeForwardedFrom && { mimeForwardedFrom: { S: params.mimeForwardedFrom } }),
        subject: { S: params.subject },
        parsedContent: { S: params.parsedContent },
        businessGroup: { S: params.businessGroup },
        businessRule: { S: params.businessRule },
        mailbox: { S: params.mailbox },
        sender: { S: params.senderEmail },
        lastUpdated: { S: new Date().toISOString() },
        createdOn: { S: new Date().toISOString() },
        ttl: {
          N: ttl.toString(),
        },
      },
    };
    const command = new PutItemCommand(input);
    const output = await this.client.send(command);
    return output;
  }

  async updateEmailStatus(sesMessageId: string, status: string, table: string) {
    const input: UpdateItemCommandInput = {
      TableName: table,
      Key: {
        pk: { S: 'EMAIL' },
        sk: { S: sesMessageId },
      },
      UpdateExpression: 'SET #status = :status, #lastUpdated = :lastUpdated',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#lastUpdated': 'lastUpdated',
      },
      ExpressionAttributeValues: {
        ':status': { S: status },
        ':lastUpdated': { S: new Date().toISOString() },
      },
      ReturnValues: 'ALL_NEW',
    };
    const command = new UpdateItemCommand(input);
    const output = await this.client.send(command);

    if (output.Attributes) {
      console.log('have attributes');
      const newAk = `EMAIL#${output.Attributes.businessGroup.S}#${output.Attributes.status.S}`;
      console.log(newAk);
      await this.updateAkField(output.Attributes.pk.S as string, output.Attributes.sk.S as string, newAk, table);
    }

    return output;
  }

  async updateAkField(pk: string, sk: string, ak: string, table: string) {
    const input: UpdateItemCommandInput = {
      TableName: table,
      Key: {
        pk: { S: pk },
        sk: { S: sk },
      },
      UpdateExpression: 'SET #akTypeBusinessGroup = :akTypeBusinessGroup',
      ExpressionAttributeNames: {
        '#akTypeBusinessGroup': 'akTypeBusinessGroup',
      },
      ExpressionAttributeValues: {
        ':akTypeBusinessGroup': { S: ak },
      },
    };
    const command = new UpdateItemCommand(input);
    const output = await this.client.send(command);

    return output;
  }
}
