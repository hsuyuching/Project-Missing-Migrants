import pandas as pd
import numpy as np


df = pd.read_csv('../MissingMigrantsProject.csv')
df['region_origin'] = df['region_origin'].replace(np.nan, "UNKNOWN")
df = df.dropna(subset=['cause_of_death'])
df = df[~df.cause_of_death.str.contains('Unknown', na=False)]

df['dead'].fillna(0, inplace=True)
df['missing'].fillna(0, inplace=True)

df = df.dropna(subset=['affected_nationality'])
df = df[~df.affected_nationality.str.contains('Unknown', na=False)]
""" df['cause_of_death'] = df['cause_of_death'].replace(np.nan, "UNKNOWN") """
""" df['affected_nationality'] = df['affected_nationality'].replace(
    np.nan, "UNKNOWN") """
df['missing'] = df['missing'].replace(np.nan, "0")

new_df = df.drop('affected_nationality', axis=1).join(
    df.affected_nationality
    .str
    .split(', ', expand=True)
    .stack()
    .reset_index(drop=True, level=1)
    .rename('affected_nationality'))


to_drop = ['source',
           'reliability',
           'date',
           'lat',
           'lon',
           'region_origin',
           'incident_region']
new_df = new_df.drop(to_drop, axis=1)

new_df['dead'] = new_df.groupby(['id'])['dead'].transform(lambda x: x / len(x))
new_df['missing'] = new_df.groupby(['id'])['missing'].transform(lambda x: x / len(x))


print(new_df)
# Don't forget to add '.csv' at the end of the path
export_csv = new_df.to_csv(r'./export_dataframe.csv', index=None, header=True)
