"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  PawPrint,
  ShoppingBag,
} from "lucide-react";

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("30");
  const [isLoading, setIsLoading] = useState(true);
  const [animalData, setAnimalData] = useState([]);
  const [userEngagementData, setUserEngagementData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [providerBookingsData, setProviderBookingsData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalAnimals: 0,
    activeUsers: 0,
    marketplaceSales: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken"); // Adjust based on your auth setup
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [animalsRes, usersRes, productsRes] = await Promise.all([
          axios.get(`/api/admin/animal?days=${timeRange}`, { headers }),
          axios.get(`/api/admin/user?days=${timeRange}`, { headers }),
          axios.get(`/api/admin/product?days=${timeRange}`, { headers }),
        ]);

        console.log("Animal API response:", animalsRes.data);
        console.log("User API response:", usersRes.data);
        console.log("Product API response:", productsRes.data);

        setAnimalData(animalsRes.data.animalData || []);
        setUserEngagementData(usersRes.data.engagementData || []);
        setProviderBookingsData(usersRes.data.providerBookings || []);
        setProductCategoryData(productsRes.data.categoryData || []);
        setSummaryStats({
          totalAnimals: animalsRes.data.totalAnimals || 0,
          activeUsers: usersRes.data.activeUsers || 0,
          marketplaceSales: productsRes.data.totalSales || 0,
        });
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const exportData = async (format) => {
    try {
      const response = await axios.get(
        `/api/admin/export?format=${format}&days=${timeRange}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `statistics.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-auxiliary dark:text-foreground">
            Statistics & Analytics
          </h1>
          <p className="text-auxiliary/70 dark:text-muted-foreground mt-1">
            Comprehensive insights into platform performance and user engagement
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => exportData("csv")}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button
            onClick={() => exportData("pdf")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-auxiliary/70 dark:text-muted-foreground">
                  Total Animals
                </p>
                <p className="text-2xl font-bold text-auxiliary dark:text-foreground">
                  {summaryStats.totalAnimals
                    ? summaryStats.totalAnimals.toLocaleString()
                    : "N/A"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2%
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <PawPrint className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-auxiliary/70 dark:text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-auxiliary dark:text-foreground">
                  {summaryStats.activeUsers
                    ? summaryStats.activeUsers.toLocaleString()
                    : "N/A"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-accent/10">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-auxiliary/70 dark:text-muted-foreground">
                  Marketplace Sales
                </p>
                <p className="text-2xl font-bold text-auxiliary dark:text-foreground">
                  {summaryStats.marketplaceSales
                    ? `€${summaryStats.marketplaceSales.toLocaleString()}`
                    : "N/A"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.8%
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-auxiliary/10">
                <ShoppingBag className="w-6 h-6 text-auxiliary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-auxiliary dark:text-foreground">
              Animals by Type
            </CardTitle>
            <CardDescription>
              Distribution of registered animals and lost/found status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={animalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#E29578" name="Total" />
                <Bar dataKey="lost" fill="#006D77" name="Lost" />
                <Bar dataKey="found" fill="#83C5BE" name="Found" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-auxiliary dark:text-foreground">
              User Engagement Trends
            </CardTitle>
            <CardDescription>
              Total users vs active users over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#83C5BE"
                  strokeWidth={2}
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#006D77"
                  strokeWidth={2}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-auxiliary dark:text-foreground">
              Marketplace Categories
            </CardTitle>
            <CardDescription>Product distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            {productCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                No data available for the selected time period.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-auxiliary dark:text-foreground">
              Service Provider Bookings
            </CardTitle>
            <CardDescription>Monthly bookings by provider type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={providerBookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="veterinarians"
                  stroke="#E29578"
                  strokeWidth={2}
                  name="Veterinarians"
                />
                <Line
                  type="monotone"
                  dataKey="trainers"
                  stroke="#83C5BE"
                  strokeWidth={2}
                  name="Trainers"
                />
                <Line
                  type="monotone"
                  dataKey="groomers"
                  stroke="#006D77"
                  strokeWidth={2}
                  name="Groomers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
