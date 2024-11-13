#include "ns3/flow-monitor-helper.h"
#include <iostream>
#include <fstream>
#include <cmath>
#include <vector>

using namespace ns3;

void SaveMetricsToXml(const std::vector<double>& fct, double fairnessIndex, double convergenceTime) {
    std::ofstream xmlFile("MetricsResults.xml");
    xmlFile << "<Metrics>" << std::endl;

    xmlFile << "  <FlowCompletionTimes>" << std::endl;
    for (double time : fct) {
        xmlFile << "    <FCT>" << time << "</FCT>" << std::endl;
    }
    xmlFile << "  </FlowCompletionTimes>" << std::endl;

    xmlFile << "  <FairnessIndex>" << fairnessIndex << "</FairnessIndex>" << std::endl;
    xmlFile << "  <ConvergenceTime>" << convergenceTime << "</ConvergenceTime>" << std::endl;

    xmlFile << "</Metrics>" << std::endl;
    xmlFile.close();
}

double CalculateFairnessIndex(const std::vector<double>& throughputs) {
    double sum = 0.0, sumSquares = 0.0;
    for (double throughput : throughputs) {
        sum += throughput;
        sumSquares += throughput * throughput;
    }
    int n = throughputs.size();
    return (sum * sum) / (n * sumSquares);
}

int main() {
    NodeContainer nodes;
    nodes.Create(4);
    
    FlowMonitorHelper flowHelper;
    Ptr<FlowMonitor> monitor = flowHelper.InstallAll();

    Simulator::Stop(Seconds(20.0));
    Simulator::Run();

    std::vector<double> fct;
    std::vector<double> throughputs;
    double convergenceTime = 0.0;

    monitor->CheckForLostPackets();
    auto stats = monitor->GetFlowStats();

    for (auto& stat : stats) {
        double completionTime = stat.second.timeLastRxPacket.GetSeconds() - stat.second.timeFirstTxPacket.GetSeconds();
        fct.push_back(completionTime);

        double throughput = stat.second.rxBytes * 8.0 / completionTime;
        throughputs.push_back(throughput);
    }

    double fairnessIndex = CalculateFairnessIndex(throughputs);
    
    // Save metrics to XML
    SaveMetricsToXml(fct, fairnessIndex, convergenceTime);

    Simulator::Destroy();
    return 0;
}
