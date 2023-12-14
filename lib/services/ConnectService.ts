import {
  ConnectClient,
  ConnectPaginationConfiguration,
  CurrentMetricResult,
  DescribeContactCommand,
  DescribeContactCommandInput,
  GetContactAttributesCommand,
  GetContactAttributesCommandInput,
  GetCurrentMetricDataCommandInput,
  ListQueuesCommandInput,
  paginateGetCurrentMetricData,
  paginateListQueues,
  QueueSummary,
  StopContactCommand,
  StopContactCommandInput,
} from 'npm:@aws-sdk/client-connect@3.425';

export class ConnectService {
  private client: ConnectClient;
  private paginatorConfig: ConnectPaginationConfiguration;

  constructor(credentials: any, region: string) {
    const config = { credentials, region };
    this.client = new ConnectClient(config);
    this.paginatorConfig = {
      client: this.client,
      pageSize: 25,
    };
  }

  async stopContact(instanceId: string, contactId: string) {
    const params: StopContactCommandInput = {
      InstanceId: instanceId,
      ContactId: contactId,
    };

    const command = new StopContactCommand(params);
    return await this.client.send(command);
  }

  async describeContact(instanceId: string, contactId: string) {
    const params: DescribeContactCommandInput = {
      InstanceId: instanceId,
      ContactId: contactId,
    };

    const command = new DescribeContactCommand(params);
    return await this.client.send(command);
    // { // DescribeContactResponse
    //   Contact: { // Contact
    //     Arn: "STRING_VALUE",
    //     Id: "STRING_VALUE",
    //     InitialContactId: "STRING_VALUE",
    //     PreviousContactId: "STRING_VALUE",
    //     InitiationMethod: "INBOUND" || "OUTBOUND" || "TRANSFER" || "QUEUE_TRANSFER" || "CALLBACK" || "API" || "DISCONNECT" || "MONITOR" || "EXTERNAL_OUTBOUND",
    //     Name: "STRING_VALUE",
    //     Description: "STRING_VALUE",
    //     Channel: "VOICE" || "CHAT" || "TASK",
    //     QueueInfo: { // QueueInfo
    //       Id: "STRING_VALUE",
    //       EnqueueTimestamp: new Date("TIMESTAMP"),
    //     },
    //     AgentInfo: { // AgentInfo
    //       Id: "STRING_VALUE",
    //       ConnectedToAgentTimestamp: new Date("TIMESTAMP"),
    //     },
    //     InitiationTimestamp: new Date("TIMESTAMP"),
    //     DisconnectTimestamp: new Date("TIMESTAMP"),
    //     LastUpdateTimestamp: new Date("TIMESTAMP"),
    //     ScheduledTimestamp: new Date("TIMESTAMP"),
    //     RelatedContactId: "STRING_VALUE",
    //     WisdomInfo: { // WisdomInfo
    //       SessionArn: "STRING_VALUE",
    //     },
    //   },
    // };
  }

  async getContactAttributes(instanceId: string, contactId: string) {
    const params: GetContactAttributesCommandInput = {
      InstanceId: instanceId,
      InitialContactId: contactId,
    };

    const command = new GetContactAttributesCommand(params);
    return await this.client.send(command);
  }

  public async listStandardQueues(
    conntactInstanceId: string,
  ): Promise<QueueSummary[]> {
    const params: ListQueuesCommandInput = {
      InstanceId: conntactInstanceId,
      QueueTypes: ['STANDARD'],
      MaxResults: 100,
    };

    const paginatorConfig: ConnectPaginationConfiguration = {
      client: this.client,
      pageSize: 25,
    };

    const result: QueueSummary[] = [];
    const paginator = paginateListQueues(paginatorConfig, params);
    for await (const data of paginator) {
      if (data.QueueSummaryList) {
        for (const item of data.QueueSummaryList) {
          if (item.Id) {
            result.push(item);
          }
        }
      }
    }
    return result;
  }

  public async getCurrentMetricData(
    params: GetCurrentMetricDataCommandInput,
  ): Promise<CurrentMetricResult[]> {
    const paginator = paginateGetCurrentMetricData(
      this.paginatorConfig,
      params,
    );

    let result: CurrentMetricResult[] = [];
    for await (const page of paginator) {
      if (page.MetricResults) {
        result = result.concat(page.MetricResults);
      }
    }
    return result;
  }
}
