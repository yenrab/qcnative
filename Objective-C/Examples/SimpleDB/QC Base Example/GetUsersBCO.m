//
//  GetUsersBCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "GetUsersBCO.h"
#import "QCRequestHandler.h"


@implementation GetUsersBCO


+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{

    //get the managed object context for use in the core data request
    QCRequestHandler *theHandler = [parameters objectForKey:@"qcrequest handler"];
    NSString *contextKey = @"dataContext";
    NSManagedObjectContext *managedObjectContext = [parameters objectForKey:contextKey];
    if(!managedObjectContext){
        //build the managed object context in this thread if it doesn't already exist
        NSPersistentStoreCoordinator *theCoordinator = theHandler.coordinator;
        managedObjectContext = [[NSManagedObjectContext alloc] init];
        [managedObjectContext setPersistentStoreCoordinator: theCoordinator];
        [parameters setObject:managedObjectContext forKey:contextKey];
    }
    
    //setup a description of the User managed object
	NSEntityDescription *entity = [NSEntityDescription entityForName:@"User" 
                                              inManagedObjectContext:managedObjectContext];
    //setup a request
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    [request setEntity:entity];

    //execute the request
    NSError *error = nil;
    NSMutableArray *users = [[managedObjectContext executeFetchRequest:request error:&error] mutableCopy];
    if (error != nil) {
        // An example of how to handle errors
        [parameters setObject:[error localizedDescription] forKey:@"description"];
        [parameters setObject:[error localizedFailureReason] forKey:@"description"];
        [theHandler dispatchToECO:@"genericError" withParameters:parameters];
        return QC_STACK_EXIT;
    }
    [parameters setObject:users forKey:@"userList"];
    return QC_STACK_CONTINUE;
}

@end
