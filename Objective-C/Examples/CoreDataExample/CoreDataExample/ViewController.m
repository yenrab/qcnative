//
//  ViewController.m
//  CoreDataExample
//
//  Created by Lee Barney on 9/21/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import "ViewController.h"
#import "AppDelegate.h"
#import "QuickConnect.h"

#import "checkNameValCO.h"
#import "AddUserBCO.h"
#import "ShowSuccessVCO.h"
#import "GetUsersBCO.h"
#import "ListUsersVCO.h"
#import "UrlCheckValCO.h"
#import "GetRequestBCO.h"
#import "DisplayHtmlVCO.h"
#import "GenericECO.h"
#import "MissingValueECO.h"
#import "HideKeyboardVCO.h"

@interface ViewController ()
- (NSManagedObjectContext *)managedObjectContext;
- (NSPersistentStoreCoordinator*)persistentStoreCoordinator;
@end

@implementation ViewController

@synthesize aQC;

- (NSManagedObjectContext *)managedObjectContext {
    AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    return appDelegate.managedObjectContext;
}

- (NSPersistentStoreCoordinator*)persistentStoreCoordinator{
    AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    return appDelegate.persistentStoreCoordinator;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    aQC = [[QuickConnect alloc] initWithPersistentStoreCoodinator:self.persistentStoreCoordinator];
    
    
    //Map your commands to your handlers here.  This is done only once.
    
    /*
     * control stack for inserting a user
     */
    
    [aQC mapCommandToValCO:@"add" withObject:[CheckNameValCO class]];
	[aQC mapCommandToDCO:@"add" withObject:[AddUserBCO class]];
	[aQC mapCommandToVCO:@"add" withObject:[ShowSuccessVCO class]];
    [aQC mapCommandToVCO:@"add" withObject:[HideKeyboardVCO class]];
    
    /*
     * control stack for displaying all user information
     */
	[aQC mapCommandToDCO:@"query" withObject:[GetUsersBCO class]];
	[aQC mapCommandToVCO:@"query" withObject:[ListUsersVCO class]];
    [aQC mapCommandToVCO:@"query" withObject:[HideKeyboardVCO class]];
    
    
    /*
     * control stack for executing HTTP GET
     */
    
    [aQC mapCommandToValCO:@"requestHtml" withObject:[UrlCheckValCO class]];
	[aQC mapCommandToDCO:@"requestHtml" withObject:[GetRequestBCO class]];
	[aQC mapCommandToVCO:@"requestHtml" withObject:[DisplayHtmlVCO class]];
    [aQC mapCommandToVCO:@"requestHtml" withObject:[HideKeyboardVCO class]];
    
    
	/*
	 *  Error handling for an empty text field.
	 *  Any number of ECO's can be mapped.
	 */
	[aQC mapCommandToECO:@"missingValue" withObject:[MissingValueECO class]];
    
    
	/*
	 *  Error handling for multiple types of errors
	 */
	[aQC mapCommandToECO:@"genericError" withObject:[GenericECO class]];
}

- (void)viewDidUnload
{
    [self setUrlInput:nil];
    [self setNameInput:nil];
    [self setResultView:nil];
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	return YES;
}

/*
 *  Example specific IBActions
 */

-(void) doInsert: (id) sender{
    NSMutableDictionary *paramsDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.nameInput.text, @"name", self.nameInput, @"nameInput", self.urlInput, @"urlInput",self.resultView, @"resultDisplay", nil];
    [aQC handleRequest:@"add" withParameters:paramsDictionary];
}
-(void) doQuery: (id) sender{
    NSMutableDictionary *paramsDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.nameInput.text, @"name", self.nameInput, @"nameInput", self.urlInput, @"urlInput",self.resultView, @"resultDisplay", nil];
    [aQC handleRequest:@"query" withParameters:paramsDictionary];
}
-(void) doHTTPRequest: (id) sender{
    NSMutableDictionary *paramsDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.nameInput, @"nameInput", self.urlInput.text, @"url", self.urlInput, @"urlInput",self.urlInput.text, @"url", self.resultView, @"resultDisplay", nil];
    [aQC handleRequest:@"requestHtml" withParameters:paramsDictionary];
}
@end
