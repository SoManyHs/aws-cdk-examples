import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-ecs');

// Create a cluster
const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro')
});

// Create Task Definition with placement constraint
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 256,
});

container.addPortMappings({
  containerPort: 80,
  hostPort: 8080,
  protocol: ecs.Protocol.Tcp
});

// Create Service
new ecs.Ec2Service(stack, "Service", {
  cluster,
  taskDefinition,
  daemon: true,
});

app.run();
