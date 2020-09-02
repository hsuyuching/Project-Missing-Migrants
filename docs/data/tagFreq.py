import pandas as pd
import numpy as np

incidents = df = pd.read_csv('./MissingMigrantsProjectV2.csv')
to_drop = ['source',
           'reliability',
           'date',
           'lat',
           'lon',
           'region_origin',
           'incident_region',
           'affected_nationality']
new_df = incidents.drop(to_drop, axis=1)



print(new_df.groupby('cause_of_death')['dead'].agg('sum'))