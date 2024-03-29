%VERTEX LAT LONG
%Up Left Corner: 39.549937, -8.819350
%Up Right Corner: 39.549937, -8.761150
%Down Left Corner: 39.505018, -8.819350
%Down Right Corner: 39.505018, -8.761150

clearvars;
clc;

SAMPLES = 100;
API_KEY = '<GOOGLE_ELEVATION_MAP_API>'; % Read https://developers.google.com/maps/documentation/elevation/get-api-key

Coord1 = [63.443756,10.314377];
Coord2 = [63.400132,10.447823];

try
load(['backup_' num2str(SAMPLES)]);

% Sucess loaded but the number of samples are different or the
% coordinates are different. Need to request elevations again.
if length(lat_map)~=SAMPLES || lat_map(1)~=Coord1(1) || lng_map(1)~=Coord1(2) ...
|| lat_map(length(lat_map),1)~=Coord2(1) || lng_map(1,length(lng_map))~=Coord2(2)

disp('Requesting Elevations to Google');

lat = linspace(Coord1(1), Coord2(1), SAMPLES); %Latitude Points

% Preallocating memory for speed improvement
elevation_map = NaN(SAMPLES, SAMPLES);
resolution_map = NaN(SAMPLES, SAMPLES);
lat_map = NaN(SAMPLES, SAMPLES);
lng_map = NaN(SAMPLES, SAMPLES);

% Gets the area elevations.
for r=1:length(lat)
[elevation_map(r,:), resolution_map(r,:), lat_map(r,:), lng_map(r,:)] = getElevationsPath(lat(r), Coord1(2), lat(r), Coord2(2), SAMPLES, 'key', API_KEY);
end

save(['backup_' num2str(SAMPLES)], 'elevation_map', 'resolution_map', 'lat_map', 'lng_map');
end
catch

disp('Requesting Elevations to Google');

lat = linspace(Coord1(1), Coord2(1), SAMPLES); %Latitude Points

% Preallocating memory for speed improvement
elevation_map = NaN(SAMPLES, SAMPLES);
resolution_map = NaN(SAMPLES, SAMPLES);
lat_map = NaN(SAMPLES, SAMPLES);
lng_map = NaN(SAMPLES, SAMPLES);

% Gets the area elevations.
for r=1:length(lat)
[elevation_map(r,:), resolution_map(r,:), lat_map(r,:), lng_map(r,:)] = getElevationsPath(lat(r), Coord1(2), lat(r), Coord2(2), SAMPLES, 'key', API_KEY);
end

save(['backup_' num2str(SAMPLES)], 'elevation_map', 'resolution_map', 'lat_map', 'lng_map');
end

disp('Displaying Data');

% Displays the data
figure('Name','Elevation');

meshc(lng_map(1,:), lat_map(:,1), elevation_map);
title('Elevation profile from Trondheim');
xlabel('Latitude (º)');
ylabel('Longitude (º)');
zlabel('Elevation (m)');
colorbar;
